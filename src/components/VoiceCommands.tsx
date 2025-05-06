
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { VoiceWaveform } from './VoiceIndicator';
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const VoiceCommands = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const commands = [
    { command: "compose", description: "Create a new email" },
    { command: "compose to [name]", description: "Create email to specific person" },
    { command: "subject [text]", description: "Set email subject" },
    { command: "message [text]", description: "Set email body" },
    { command: "send", description: "Send current email" },
    { command: "read", description: "Read latest email" },
    { command: "read unread", description: "Read the latest unread email" },
    { command: "read email from [name]", description: "Read email from specific person" },
    { command: "how many emails", description: "Count total emails" },
    { command: "how many unread emails", description: "Count unread emails" },
    { command: "delete", description: "Delete current email" },
    { command: "inbox", description: "Return to inbox" },
    { command: "reply", description: "Reply to current email" },
    { command: "forward", description: "Forward current email" },
    { command: "mark as unread", description: "Mark current email as unread" },
    { command: "archive", description: "Archive current email" },
    { command: "search for [text]", description: "Search emails containing text" },
    { command: "stop listening", description: "Turn off voice recognition" }
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100 shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          Voice Commands
          <VoiceWaveform />
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto pt-4">
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-white border-purple-100 focus-visible:ring-purple-400"
            aria-label="Search commands"
          />
        </div>
        
        <div className="bg-purple-100 p-3 rounded-lg mb-4 text-center text-purple-800">
          <strong>Voice-only mode enabled</strong>
          <p className="text-xs mt-1">Use the commands below by speaking them out loud</p>
        </div>
        
        <Table>
          <TableBody>
            {filteredCommands.map((cmd, idx) => (
              <TableRow key={idx} className="hover:bg-purple-50">
                <TableCell className="font-medium text-purple-700 w-1/2">"{cmd.command}"</TableCell>
                <TableCell className="text-gray-600 w-1/2">{cmd.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
