
import React from 'react';
import { Mail } from 'lucide-react';
import { VoiceWaveform } from './VoiceIndicator';

export const Header = () => {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6" />
          <h1 className="text-xl font-bold">Voice Mail Wizard</h1>
        </div>
        <VoiceWaveform />
      </div>
    </header>
  );
};
