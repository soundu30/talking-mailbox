
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { VoiceWaveform } from './VoiceIndicator';

export const VoiceCommands = () => {
  const commands = [
    { command: "compose", description: "Create a new email" },
    { command: "compose to [name]", description: "Create email to specific person" },
    { command: "subject [text]", description: "Set email subject" },
    { command: "message [text]", description: "Set email body" },
    { command: "send", description: "Send current email" },
    { command: "read", description: "Read latest email" },
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
      <CardContent>
        <ul className="space-y-2">
          {commands.map((cmd, idx) => (
            <li key={idx} className="flex">
              <span className="inline-block w-40 font-medium text-primary">"{cmd.command}"</span>
              <span className="text-gray-600">{cmd.description}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
