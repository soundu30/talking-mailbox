
import React from 'react';
import { useVoiceMail } from '@/contexts/VoiceMailContext';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash, Reply, Mail, Archive } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const MailDetail = () => {
  const { currentEmail, setCurrentEmail, deleteEmail } = useVoiceMail();

  if (!currentEmail) return null;

  return (
    <Card className="mt-6 border-purple-100 shadow-lg bg-gradient-to-br from-white to-purple-50">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentEmail(null)}
            className="mr-2 text-white hover:text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h2 className="text-lg font-semibold line-clamp-1">{currentEmail.subject}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteEmail(currentEmail.id)}
          className="text-white hover:text-white hover:bg-white/20"
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div className="flex justify-between items-center pb-4 border-b border-purple-100">
          <div>
            <p className="font-medium text-purple-700">From: {currentEmail.from}</p>
            <p className="text-sm text-gray-500">To: {currentEmail.to}</p>
          </div>
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {formatDistanceToNow(new Date(currentEmail.date), { addSuffix: true })}
          </p>
        </div>

        <div className="pt-2">
          <p className="whitespace-pre-line text-gray-700">{currentEmail.body}</p>
        </div>
      </CardContent>

      <CardFooter className="border-t border-purple-100 p-6 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentEmail(null)}
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <Mail className="h-4 w-4 mr-2" />
          Back to Inbox
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
