
import React from 'react';
import { useVoiceMail } from '@/contexts/VoiceMailContext';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const MailDetail = () => {
  const { currentEmail, setCurrentEmail, deleteEmail } = useVoiceMail();

  if (!currentEmail) return null;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentEmail(null)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h2 className="text-lg font-semibold">{currentEmail.subject}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteEmail(currentEmail.id)}
          className="text-gray-400 hover:text-destructive hover:bg-destructive/10"
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">From: {currentEmail.from}</p>
            <p className="text-sm text-gray-500">To: {currentEmail.to}</p>
          </div>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(currentEmail.date), { addSuffix: true })}
          </p>
        </div>

        <div className="pt-4 border-t">
          <p className="whitespace-pre-line">{currentEmail.body}</p>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentEmail(null)}
        >
          Back to Inbox
        </Button>
      </CardFooter>
    </Card>
  );
};
