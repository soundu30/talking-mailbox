
import React from 'react';
import { useVoiceMail } from '@/contexts/VoiceMailContext';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const MailList = () => {
  const { emails, readEmail, currentEmail, deleteEmail } = useVoiceMail();

  // Sort emails by date (newest first)
  const sortedEmails = [...emails].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  return (
    <div className="flex flex-col gap-3 mt-4">
      {sortedEmails.length === 0 ? (
        <div className="text-center p-8">
          <Mail className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No emails</h3>
          <p className="text-sm text-gray-500">Your inbox is empty</p>
        </div>
      ) : (
        sortedEmails.map((email) => (
          <Card 
            key={email.id}
            className={cn(
              "cursor-pointer hover:shadow-md transition-shadow",
              !email.read && "border-l-4 border-l-primary",
              currentEmail?.id === email.id && "ring-2 ring-primary"
            )}
            onClick={() => readEmail(email)}
          >
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{email.from}</p>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                  </span>
                </div>
                <h3 className={cn(
                  "text-lg", 
                  !email.read && "font-semibold"
                )}>
                  {email.subject}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {email.body}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEmail(email.id);
                }}
                className="text-gray-400 hover:text-destructive hover:bg-destructive/10"
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
