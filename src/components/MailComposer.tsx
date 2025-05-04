
import React from 'react';
import { useVoiceMail } from '@/contexts/VoiceMailContext';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';

export const MailComposer = () => {
  const { draftEmail, setDraftEmail, sendEmail, setComposeMode } = useVoiceMail();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmail();
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setComposeMode(false)}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-lg font-semibold">Compose Email</h2>
      </CardHeader>

      <form onSubmit={handleFormSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              placeholder="recipient@example.com"
              value={draftEmail.to}
              onChange={(e) => setDraftEmail({ ...draftEmail, to: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Subject"
              value={draftEmail.subject}
              onChange={(e) => setDraftEmail({ ...draftEmail, subject: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              placeholder="Write your message here..."
              rows={8}
              value={draftEmail.body}
              onChange={(e) => setDraftEmail({ ...draftEmail, body: e.target.value })}
              className="resize-none"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button type="submit" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
