
import React, { useMemo } from 'react';
import { Message, MessageAuthor } from '../types';
import { UserIcon, SparklesIcon, FileTextIcon } from './icons';

// Since we are using a CDN for marked, we declare it globally.
declare global {
  interface Window {
    marked: {
      parse(markdownString: string, options?: any): string;
    };
  }
}

interface MessageBubbleProps {
  message: Message;
}

const BlinkingCursor: React.FC = () => (
  <span className="inline-block w-2 h-5 bg-brand-accent ml-1 animate-pulse" />
);

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;

  const parsedHtml = useMemo(() => {
    if (message.text && window.marked) {
        let sanitizedText = message.text
            // Basic sanitization to prevent unclosed tags; not a full XSS solution.
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Re-allow code block syntax that got escaped
        sanitizedText = sanitizedText.replace(/&lt;pre&gt;&lt;code class="language-(.*?)"&gt;/g, '<pre><code class="language-$1">');
        sanitizedText = sanitizedText.replace(/&lt;\/code&gt;&lt;\/pre&gt;/g, '</code></pre>');

        return window.marked.parse(sanitizedText, {
            gfm: true,
            breaks: true,
            renderer: {
                code(code: string, lang: string) {
                    return `<pre><code class="language-${lang} code-block">${code}</code></pre>`;
                }
            }
        });
    }
    return message.text;
  }, [message.text]);

  return (
    <div className={`flex items-start gap-3 animate-fadeIn ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-brand-accent flex-shrink-0 flex items-center justify-center text-brand-bg">
          <SparklesIcon className="w-5 h-5" />
        </div>
      )}
      <div className={`max-w-xl w-fit rounded-2xl px-4 py-3 ${isUser ? 'bg-blue-600 rounded-br-lg' : 'bg-brand-surface rounded-bl-lg'}`}>
        {message.attachedFile && (
          <div className="mb-2 p-2 bg-black/20 rounded-lg flex items-center gap-2 text-sm border border-white/10">
            <FileTextIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">{message.attachedFile.name}</span>
          </div>
        )}
        
        {message.imageUrl ? (
          <div className="space-y-2">
            <p className="text-white/90">{message.text}</p>
            <img src={message.imageUrl} alt={message.text} className="rounded-lg max-w-sm" />
          </div>
        ) : (
          <div className="text-white/90 prose prose-invert prose-p:my-2 prose-headings:my-3 max-w-none" dangerouslySetInnerHTML={{ __html: parsedHtml }} />
        )}
        
        {message.isLoading && <BlinkingCursor />}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center">
          <UserIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
