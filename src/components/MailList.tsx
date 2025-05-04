
import React, { useState } from 'react';
import { useVoiceMail } from '@/contexts/VoiceMailContext';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Trash, Search, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const MailList = () => {
  const { emails, readEmail, currentEmail, deleteEmail } = useVoiceMail();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Filter emails by search term and unread status if selected
  const filteredEmails = emails.filter(email => {
    const matchesSearch = searchTerm === '' || 
                         email.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         email.from.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         email.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch && (!showUnreadOnly || !email.read);
  });

  // Sort emails by date (newest first)
  const sortedEmails = [...filteredEmails].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  const unreadCount = emails.filter(email => !email.read).length;

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-white border-purple-100 focus-visible:ring-purple-400"
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={cn(
            "border-purple-100",
            showUnreadOnly && "bg-purple-100 text-purple-700"
          )}
        >
          <Filter className="h-4 w-4" />
          <span className="sr-only">{showUnreadOnly ? 'Show all' : 'Show unread'}</span>
        </Button>
        <Button 
          variant="outline"
          size="icon"
          onClick={() => window.location.reload()}
          className="border-purple-100"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700">
          {showUnreadOnly ? 'Unread emails' : 'All emails'}
        </h3>
        <Badge variant="outline" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
          {unreadCount} unread
        </Badge>
      </div>

      {sortedEmails.length === 0 ? (
        <Card className="text-center p-8 bg-white border-purple-100">
          <Mail className="mx-auto h-12 w-12 text-purple-200" />
          <h3 className="mt-2 text-lg font-medium text-purple-800">No emails found</h3>
          <p className="text-sm text-gray-500">
            {searchTerm ? 'Try a different search term' : showUnreadOnly ? 'No unread emails' : 'Your inbox is empty'}
          </p>
        </Card>
      ) : (
        sortedEmails.map((email) => (
          <Card 
            key={email.id}
            className={cn(
              "cursor-pointer hover:shadow-md transition-shadow bg-white",
              !email.read && "border-l-4 border-l-purple-500",
              email.read && "bg-white/80",
              currentEmail?.id === email.id && "ring-2 ring-purple-300"
            )}
            onClick={() => readEmail(email)}
          >
            <CardContent className="p-4 flex justify-between items-start">
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <p className={cn(
                    "font-medium", 
                    !email.read ? "text-purple-700" : "text-gray-600"
                  )}>
                    {email.from}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                  </span>
                </div>
                <h3 className={cn(
                  "text-lg", 
                  !email.read ? "font-semibold text-gray-800" : "text-gray-600"
                )}>
                  {email.subject}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-1 mt-1">
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
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2 flex-shrink-0"
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
