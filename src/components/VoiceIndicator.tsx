
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceMail } from '@/contexts/VoiceMailContext';
import { cn } from '@/lib/utils';

export const VoiceIndicator = () => {
  const { isListening, toggleListening, interimTranscript, voiceRecognition, composeMode, draftEmail } = useVoiceMail();

  if (!voiceRecognition?.isSupported()) {
    return (
      <div className="fixed bottom-4 right-4 flex items-center p-3 bg-red-100 text-red-800 rounded-lg shadow-lg">
        <MicOff className="mr-2 h-5 w-5" />
        <span>Voice recognition not supported in this browser</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {isListening && interimTranscript && (
        <div className="mb-2 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg max-w-xs opacity-90 backdrop-blur-sm">
          <p className="text-sm">{interimTranscript}</p>
        </div>
      )}
      
      {composeMode && !isListening && (
        <div className="mb-2 p-4 bg-orange-500 text-white rounded-lg shadow-lg max-w-xs opacity-90 backdrop-blur-sm">
          <p className="text-sm font-bold">Tap mic and use these commands:</p>
          <ul className="text-xs mt-1 list-disc pl-4">
            <li>To add recipient: "to [name]"</li>
            <li>To add subject: "subject [your subject]"</li>
            <li>To add message: "message [your message]"</li>
            <li>To send email: "send email"</li>
          </ul>
        </div>
      )}
      
      <Button 
        onClick={toggleListening}
        className={cn(
          "rounded-full w-16 h-16 flex items-center justify-center shadow-lg",
          isListening 
            ? "bg-gradient-to-r from-purple-500 to-indigo-600 pulse-animation" 
            : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600"
        )}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        {isListening ? (
          <Mic className="h-7 w-7 text-white" />
        ) : (
          <MicOff className="h-6 w-6" />
        )}
      </Button>
      <div className="mt-2 text-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
        Voice-only mode
      </div>
      <div className="mt-2 text-center bg-purple-800 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
        Keyboard input disabled
      </div>
    </div>
  );
};

export const VoiceWaveform = () => {
  const { isListening } = useVoiceMail();
  
  if (!isListening) return null;
  
  return (
    <div className="flex items-center justify-center h-8">
      <div className="flex items-end space-x-1">
        <div className="wave bg-white"></div>
        <div className="wave bg-white"></div>
        <div className="wave bg-white"></div>
        <div className="wave bg-white"></div>
        <div className="wave bg-white"></div>
      </div>
    </div>
  );
};
