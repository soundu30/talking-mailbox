
import React, { useEffect } from 'react';
import { VoiceMailProvider } from '@/contexts/VoiceMailContext';
import { Header } from '@/components/Header';
import { VoiceIndicator } from '@/components/VoiceIndicator';
import { MailList } from '@/components/MailList';
import { MailComposer } from '@/components/MailComposer';
import { MailDetail } from '@/components/MailDetail';
import { VoiceCommands } from '@/components/VoiceCommands';
import { useVoiceMail } from '@/contexts/VoiceMailContext';
import { toast } from "@/components/ui/use-toast";

// Main content component that uses the voice mail context
const MailContent = () => {
  const { composeMode, currentEmail, isListening, voiceRecognition } = useVoiceMail();
  
  useEffect(() => {
    // Display a toast notification about voice-only mode when component mounts
    toast({
      title: "Voice-Only Mode",
      description: "This is a voice-controlled application. Use the microphone button to start giving voice commands.",
      duration: 5000,
    });
  }, []);

  // If not listening and recognition is available, show a prompt
  useEffect(() => {
    if (!isListening && voiceRecognition?.isSupported()) {
      const timer = setTimeout(() => {
        toast({
          title: "Talking Mailbox",
          description: "Click the microphone button to start giving voice commands",
          duration: 3000,
        });
      }, 10000); // Show after 10 seconds of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [isListening, voiceRecognition]);
  
  let content;
  if (composeMode) {
    content = <MailComposer />;
  } else if (currentEmail) {
    content = <MailDetail />;
  } else {
    content = (
      <>
        <h2 className="text-2xl font-bold mt-6 mb-2">Inbox</h2>
        <MailList />
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {content}
        </div>
        <div className="md:col-span-1">
          <VoiceCommands />
        </div>
      </div>
    </div>
  );
};

// Index page that provides the voice mail context
const Index = () => {
  return (
    <VoiceMailProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <MailContent />
        <VoiceIndicator />
      </div>
    </VoiceMailProvider>
  );
};

export default Index;
