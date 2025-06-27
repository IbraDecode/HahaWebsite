
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Message, MessageAuthor, AttachedFile } from './types';
import { geminiService } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import WelcomeScreen from './components/WelcomeScreen';
import ParticlesBackground from './components/ParticlesBackground';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);

  useEffect(() => {
    // Initialize chat session on component mount
    chatSessionRef.current = geminiService.initChat();
  }, []);

  const handleSendMessage = useCallback(async (prompt: string, attachedFile: AttachedFile | null) => {
    if (isLoading || (!prompt && !attachedFile)) return;

    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      author: MessageAuthor.USER,
      text: prompt,
      attachedFile: attachedFile ? { name: attachedFile.name, type: attachedFile.type } : undefined,
    };
    setMessages(prev => [...prev, userMessage]);

    // Add a loading message for the AI response
    const aiMessageId = (Date.now() + 1).toString();
    const aiLoadingMessage: Message = {
      id: aiMessageId,
      author: MessageAuthor.AI,
      text: '',
      isLoading: true,
    };
    setMessages(prev => [...prev, aiLoadingMessage]);

    try {
      if (prompt.toLowerCase().startsWith('/image')) {
        const imagePrompt = prompt.substring('/image'.length).trim();
        const imageUrl = await geminiService.generateImage(imagePrompt);
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, text: `Image generated for: "${imagePrompt}"`, imageUrl, isLoading: false } : msg
        ));
      } else {
        if (!chatSessionRef.current) {
          chatSessionRef.current = geminiService.initChat();
        }
        await geminiService.streamChatResponse(
          chatSessionRef.current,
          prompt,
          attachedFile,
          (chunk) => {
            setMessages(prev => prev.map(msg => 
              msg.id === aiMessageId ? { ...msg, text: (msg.text || '') + chunk, isLoading: true } : msg
            ));
          }
        );
        // Finalize message state after stream
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, isLoading: false } : msg
        ));
      }
    } catch (error) {
      console.error("Error processing request:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, text: `Error: ${errorMessage}`, isLoading: false } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="bg-brand-bg text-white font-sans w-screen h-screen overflow-hidden flex flex-col">
      <ParticlesBackground />
      <div className="relative flex-1 flex flex-col max-w-4xl mx-auto w-full z-10 h-full">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <ChatWindow messages={messages} />
        )}
        <div className="px-4 pb-4">
          <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;
