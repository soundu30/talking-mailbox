
import React from 'react';
import { Mail, Mic } from 'lucide-react';
import { VoiceWaveform } from './VoiceIndicator';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6" />
          <h1 className="text-xl font-bold">Talking Mailbox</h1>
        </div>
        <div className="flex items-center">
          <div className="hidden sm:flex mr-4 items-center bg-purple-700/50 px-3 py-1 rounded-full text-xs font-semibold">
            <Mic className="h-3 w-3 mr-1" />
            Voice Commands Only
          </div>
          <VoiceWaveform />
        </div>
      </div>
    </header>
  );
};
