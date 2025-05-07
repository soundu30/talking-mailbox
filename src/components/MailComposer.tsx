
import React, { useEffect } from 'react';
import { useVoiceMail } from '@/contexts/VoiceMailContext';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft, Mic } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

export const MailComposer = () => {
  const { draftEmail, sendEmail, setComposeMode, voiceSynthesis, isListening, transcript } = useVoiceMail();

  useEffect(() => {
    // Announce voice commands when component mounts
    if (voiceSynthesis) {
      setTimeout(() => {
        voiceSynthesis.speak("Compose mode active. Use voice commands to set recipient, subject, and message.");
      }, 500);
    }

    // Display toast with instructions
    toast({
      title: "Voice Commands",
      description: "Say 'to [name]', 'subject [text]', and 'message [text]' to compose your email.",
      duration: 8000,
    });
  }, []);

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
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Compose Email 
          <Mic className={`h-4 w-4 ${isListening ? "animate-pulse" : "opacity-50"}`} />
        </h2>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-purple-800">To</p>
            {!draftEmail.to && (
              <p className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                Say "to [recipient]"
              </p>
            )}
          </div>
          <div className={`p-3 rounded-md border min-h-10 ${draftEmail.to ? "bg-purple-50 border-purple-200" : "bg-gray-100 border-gray-200"}`}>
            {draftEmail.to || <span className="text-gray-400">Recipient will appear here</span>}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-purple-800">Subject</p>
            {!draftEmail.subject && (
              <p className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                Say "subject [your subject]"
              </p>
            )}
          </div>
          <div className={`p-3 rounded-md border min-h-10 ${draftEmail.subject ? "bg-purple-50 border-purple-200" : "bg-gray-100 border-gray-200"}`}>
            {draftEmail.subject || <span className="text-gray-400">Subject will appear here</span>}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-purple-800">Message</p>
            {!draftEmail.body && (
              <p className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                Say "message [your message]"
              </p>
            )}
          </div>
          <div className={`p-3 rounded-md border min-h-[160px] ${draftEmail.body ? "bg-purple-50 border-purple-200" : "bg-gray-100 border-gray-200"}`}>
            {draftEmail.body || <span className="text-gray-400">Message will appear here</span>}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-6 pt-0 border-t border-purple-100">
        <div className="text-sm text-purple-700 bg-purple-50 p-2 rounded-md">
          <span className="font-medium">Note:</span> This is voice-only. Click mic button to activate voice commands.
        </div>
        <Button 
          onClick={handleSendClick} 
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          disabled={!draftEmail.to || !draftEmail.subject}
        >
          <Send className="h-4 w-4 mr-2" />
          Say "send" to send
        </Button>
      </CardFooter>
    </Card>
  );
};
