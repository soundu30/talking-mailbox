
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
import { Send, ArrowLeft, Paperclip } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MailComposer = () => {
  const { draftEmail, setDraftEmail, sendEmail, setComposeMode } = useVoiceMail();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmail();
  };

  const indianRecipients = [
    { name: "Monish", email: "monish@example.com" },
    { name: "Subash", email: "subash@example.com" },
    { name: "Soundarya", email: "soundarya@example.com" },
    { name: "Yukesh", email: "yukesh@example.com" },
    { name: "Priya", email: "priya@example.com" },
    { name: "Raj", email: "raj@example.com" },
    { name: "Divya", email: "divya@example.com" },
    { name: "Anand", email: "anand@example.com" },
    { name: "Kavitha", email: "kavitha@example.com" },
    { name: "Sanjay", email: "sanjay@example.com" },
    { name: "Ananya", email: "ananya@example.com" },
    { name: "Vikram", email: "vikram@example.com" },
    { name: "Neha", email: "neha@example.com" },
    { name: "Arjun", email: "arjun@example.com" },
    { name: "Rohan", email: "rohan@example.com" }
  ];

  const handleRecipientChange = (value: string) => {
    setDraftEmail({ ...draftEmail, to: value });
  };

  return (
    <Card className="mt-6 border-purple-100 shadow-lg bg-gradient-to-br from-white to-purple-50">
      <CardHeader className="flex flex-row items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setComposeMode(false)}
          className="mr-2 text-white hover:text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-lg font-semibold">Compose Email</h2>
      </CardHeader>

      <form onSubmit={handleFormSubmit}>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="to" className="text-purple-800">To</Label>
            <div className="flex gap-2">
              <div className="flex-grow">
                <Input
                  id="to"
                  placeholder="recipient@example.com"
                  value={draftEmail.to}
                  onChange={(e) => setDraftEmail({ ...draftEmail, to: e.target.value })}
                  className="border-purple-200 focus-visible:ring-purple-400"
                />
              </div>
              <Select onValueChange={handleRecipientChange}>
                <SelectTrigger className="w-[180px] border-purple-200">
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {indianRecipients.map((recipient) => (
                    <SelectItem key={recipient.email} value={recipient.email}>
                      {recipient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-purple-800">Subject</Label>
            <Input
              id="subject"
              placeholder="Subject"
              value={draftEmail.subject}
              onChange={(e) => setDraftEmail({ ...draftEmail, subject: e.target.value })}
              className="border-purple-200 focus-visible:ring-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body" className="text-purple-800">Message</Label>
            <Textarea
              id="body"
              placeholder="Write your message here..."
              rows={8}
              value={draftEmail.body}
              onChange={(e) => setDraftEmail({ ...draftEmail, body: e.target.value })}
              className="resize-none border-purple-200 focus-visible:ring-purple-400"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between p-6 pt-0 border-t border-purple-100">
          <Button 
            type="button" 
            variant="outline"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Attach
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
