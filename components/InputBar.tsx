
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AttachedFile } from '../types';
import { PaperclipIcon, SendIcon, XCircleIcon } from './icons';

interface InputBarProps {
  onSendMessage: (prompt: string, attachedFile: AttachedFile | null) => void;
  isLoading: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setAttachedFile({ name: file.name, type: file.type, content });
      };
      reader.readAsDataURL(file); // Read as base64 data URL
    }
  };

  const handleSend = useCallback(() => {
    if (!isLoading && (prompt.trim() || attachedFile)) {
      onSendMessage(prompt, attachedFile);
      setPrompt('');
      setAttachedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [prompt, attachedFile, isLoading, onSendMessage]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="bg-brand-surface/70 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex flex-col items-center shadow-2xl shadow-black/20">
      {attachedFile && (
        <div className="w-full bg-brand-bg/50 px-3 py-2 rounded-lg mb-2 flex justify-between items-center animate-fadeIn">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
             <PaperclipIcon className="w-4 h-4" />
             <span>{attachedFile.name}</span>
          </div>
          <button onClick={() => setAttachedFile(null)} className="text-gray-400 hover:text-white transition-colors">
            <XCircleIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      <div className="w-full flex items-end">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-brand-accent transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <PaperclipIcon className="w-6 h-6" />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Charty... (try '/image a futuristic robot')"
          className="flex-1 bg-transparent resize-none outline-none text-white placeholder-gray-500 px-3 py-2 max-h-48"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || (!prompt.trim() && !attachedFile)}
          className="p-2 rounded-full bg-brand-accent hover:bg-brand-accent-dark text-brand-bg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 scale-90 hover:scale-100"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default InputBar;
