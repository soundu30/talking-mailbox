
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

export const VoiceCommands = () => {
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
    { command: "stop listening", description: "Turn off voice recognition" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Voice Commands
          <VoiceWaveform />
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        <Table>
          <TableBody>
            {commands.map((cmd, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium text-primary w-1/2">"{cmd.command}"</TableCell>
                <TableCell className="text-gray-600 w-1/2">{cmd.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
