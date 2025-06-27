
import React from 'react';
import { SparklesIcon } from './icons';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center p-4 animate-fadeIn">
      <div className="p-4 bg-brand-accent/20 rounded-full mb-6 border-2 border-brand-accent">
        <SparklesIcon className="w-10 h-10 text-brand-accent" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Charty AI
      </h1>
      <p className="mt-4 text-lg text-gray-400 max-w-xl">
        Your creative partner for code, content, and visuals.
        Ready to build, analyze, or imagine?
      </p>
      
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        <div className="bg-brand-surface/70 border border-white/10 p-4 rounded-lg text-left">
            <h3 className="font-semibold text-white">Generate Code</h3>
            <p className="text-sm text-gray-400 mt-1">e.g., "Create a React button component with a hover effect"</p>
        </div>
        <div className="bg-brand-surface/70 border border-white/10 p-4 rounded-lg text-left">
            <h3 className="font-semibold text-white">Create Images</h3>
            <p className="text-sm text-gray-400 mt-1">e.g., "/image a cat programming on a laptop, neon style"</p>
        </div>
        <div className="bg-brand-surface/70 border border-white/10 p-4 rounded-lg text-left">
            <h3 className="font-semibold text-white">Analyze Documents</h3>
            <p className="text-sm text-gray-400 mt-1">Attach a file and ask, "Summarize this document"</p>
        </div>
        <div className="bg-brand-surface/70 border border-white/10 p-4 rounded-lg text-left">
            <h3 className="font-semibold text-white">Ask Anything</h3>
            <p className="text-sm text-gray-400 mt-1">e.g., "Explain the difference between REST and GraphQL"</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
