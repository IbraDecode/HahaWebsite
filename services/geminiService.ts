import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";
import { AttachedFile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
const IMAGE_MODEL = 'imagen-3.0-generate-002';

const initChat = (): Chat => {
    return ai.chats.create({
        model: TEXT_MODEL,
        config: {
            systemInstruction: `You are Charty AI, a world-class AI assistant specializing in software development, data analysis, and creative ideation. 
- When providing code, always wrap it in markdown code blocks with the language specified (e.g., \`\`\`typescript).
- When asked to analyze a document, provide a concise summary followed by key insights.
- Be helpful, creative, and professional.
- Your responses should be formatted in Markdown for readability.`,
            thinkingConfig: { thinkingBudget: 0 } // For lower latency
        },
    });
};

const fileToGenerativePart = async (file: AttachedFile): Promise<Part> => {
    if (!file.content) {
        throw new Error("File content is missing for processing.");
    }

    // Remove base64 prefix if present
    const base64Data = file.content.startsWith('data:') 
        ? file.content.split(',')[1] 
        : file.content;

    return {
        inlineData: {
            mimeType: file.type,
            data: base64Data,
        },
    };
};

const streamChatResponse = async (
    chat: Chat, 
    prompt: string, 
    file: AttachedFile | null, 
    onChunk: (chunk: string) => void
): Promise<void> => {
    let messageContent: string | (string | Part)[];

    if (file && file.content) {
        const filePart = await fileToGenerativePart(file);
        // Use an array for multipart messages
        messageContent = [filePart, prompt || `Please analyze this file named ${file.name}.`];
    } else {
        // Use a simple string for text-only messages
        messageContent = prompt;
    }
    
    // The message property takes either a string or an array of parts
    const responseStream = await chat.sendMessageStream({ message: messageContent });

    for await (const chunk of responseStream) {
        if (chunk.text) {
            onChunk(chunk.text);
        }
    }
};

const generateImage = async (prompt: string): Promise<string> => {
    if (!prompt) {
        throw new Error("An image description is required.");
    }

    const response = await ai.models.generateImages({
        model: IMAGE_MODEL,
        prompt: `A vibrant, high-resolution, cinematic-style image of: ${prompt}`,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        throw new Error("Image generation failed to produce an image.");
    }
};

export const geminiService = {
    initChat,
    streamChatResponse,
    generateImage,
};