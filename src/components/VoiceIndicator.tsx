
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceMail } from '@/contexts/VoiceMailContext';
import { cn } from '@/lib/utils';

export const VoiceIndicator = () => {
  const { isListening, toggleListening, interimTranscript, voiceRecognition } = useVoiceMail();

  if (!voiceRecognition?.isSupported()) {
    return (
      <div className="fixed bottom-4 right-4 flex items-center p-3 bg-red-100 text-red-800 rounded-lg shadow-lg">
        <MicOff className="mr-2 h-5 w-5" />
        <span>Voice recognition not supported in this browser</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {isListening && interimTranscript && (
        <div className="mb-2 p-3 bg-white rounded-lg shadow-lg max-w-xs">
          <p className="text-gray-600 text-sm">{interimTranscript}</p>
        </div>
      )}
      <Button 
        onClick={toggleListening}
        className={cn(
          "rounded-full w-14 h-14 flex items-center justify-center",
          isListening ? "bg-primary pulse-animation" : "bg-gray-200 text-gray-600"
        )}
      >
        {isListening ? (
          <>
            <Mic className="h-6 w-6 text-white" />
            <span className="sr-only">Stop Listening</span>
          </>
        ) : (
          <>
            <MicOff className="h-6 w-6" />
            <span className="sr-only">Start Listening</span>
          </>
        )}
      </Button>
    </div>
  );
};

export const VoiceWaveform = () => {
  const { isListening } = useVoiceMail();
  
  if (!isListening) return null;
  
  return (
    <div className="flex items-center justify-center h-8">
      <div className="flex items-end space-x-1">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
  );
};
