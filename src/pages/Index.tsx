
import React from 'react';
import { VoiceMailProvider } from '@/contexts/VoiceMailContext';
import { Header } from '@/components/Header';
import { VoiceIndicator } from '@/components/VoiceIndicator';
import { MailList } from '@/components/MailList';
import { MailComposer } from '@/components/MailComposer';
import { MailDetail } from '@/components/MailDetail';
import { VoiceCommands } from '@/components/VoiceCommands';
import { useVoiceMail } from '@/contexts/VoiceMailContext';

// Main content component that uses the voice mail context
const MailContent = () => {
  const { composeMode, currentEmail } = useVoiceMail();
  
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <MailContent />
        <VoiceIndicator />
      </div>
    </VoiceMailProvider>
  );
};

export default Index;
