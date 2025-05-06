
import React from 'react';
import { useVoiceMail } from '@/contexts/VoiceMailContext';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft } from 'lucide-react';

export const MailComposer = () => {
  const { draftEmail, sendEmail, setComposeMode, voiceSynthesis } = useVoiceMail();

  const handleSendClick = () => {
    if (voiceSynthesis) {
      voiceSynthesis.speak("To send this email, say 'send email'");
    }
  };

  const handleBackClick = () => {
    if (voiceSynthesis) {
      voiceSynthesis.speak("To go back to inbox, say 'go back' or 'inbox'");
    }
    setComposeMode(false);
  };

  return (
    <Card className="mt-6 border-purple-100 shadow-lg bg-gradient-to-br from-white to-purple-50">
      <CardHeader className="flex flex-row items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackClick}
          className="mr-2 text-white hover:text-white hover:bg-white/20"
          aria-label="Back to inbox"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-lg font-semibold">Compose Email</h2>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-purple-800">To</p>
          <div className="p-3 bg-gray-100 rounded-md border border-gray-200 min-h-10">
            {draftEmail.to || <span className="text-gray-400">Say "to [recipient]" to set recipient</span>}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-purple-800">Subject</p>
          <div className="p-3 bg-gray-100 rounded-md border border-gray-200 min-h-10">
            {draftEmail.subject || <span className="text-gray-400">Say "subject [your subject]" to set subject</span>}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-purple-800">Message</p>
          <div className="p-3 bg-gray-100 rounded-md border border-gray-200 min-h-[160px]">
            {draftEmail.body || <span className="text-gray-400">Say "message [your message]" to set message body</span>}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end p-6 pt-0 border-t border-purple-100">
        <Button 
          onClick={handleSendClick} 
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
        >
          <Send className="h-4 w-4 mr-2" />
          Say "send" to send email
        </Button>
      </CardFooter>
    </Card>
  );
};
