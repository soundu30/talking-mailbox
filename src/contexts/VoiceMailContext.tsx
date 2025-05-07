
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VoiceRecognitionService, VoiceSynthesisService } from '../lib/voiceRecognition';
import { Email, db } from '../lib/db';
import { toast } from "@/components/ui/use-toast";

interface VoiceMailContextType {
  voiceRecognition: VoiceRecognitionService | null;
  voiceSynthesis: VoiceSynthesisService | null;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  emails: Email[];
  currentEmail: Email | null;
  setCurrentEmail: (email: Email | null) => void;
  composeMode: boolean;
  setComposeMode: (mode: boolean) => void;
  draftEmail: {
    to: string;
    subject: string;
    body: string;
  };
  setDraftEmail: React.Dispatch<React.SetStateAction<{
    to: string;
    subject: string;
    body: string;
  }>>;
  sendEmail: () => void;
  readEmail: (email: Email) => void;
  deleteEmail: (id: string) => void;
  toggleListening: () => void;
}

const VoiceMailContext = createContext<VoiceMailContextType | undefined>(undefined);

export const VoiceMailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognitionService | null>(null);
  const [voiceSynthesis, setVoiceSynthesis] = useState<VoiceSynthesisService | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [currentEmail, setCurrentEmail] = useState<Email | null>(null);
  const [composeMode, setComposeMode] = useState(false);
  const [draftEmail, setDraftEmail] = useState({
    to: '',
    subject: '',
    body: ''
  });

  // Function to send an email - defined before it's used in useEffect
  const sendEmail = () => {
    if (draftEmail.to && draftEmail.subject) {
      const user = db.getUser();
      
      // Add email to "sent" in our mock DB
      const newEmail = db.addEmail({
        from: user.email,
        to: draftEmail.to,
        subject: draftEmail.subject,
        body: draftEmail.body
      });
      
      // Update emails list
      setEmails(prevEmails => [...prevEmails, newEmail]);
      
      // Reset draft and exit compose mode
      setDraftEmail({ to: '', subject: '', body: '' });
      setComposeMode(false);
      
      // Notify user
      if (voiceSynthesis) {
        voiceSynthesis.speak("Email sent successfully");
      }
      
      toast({
        title: "Email Sent!",
        description: "Your email has been sent successfully."
      });
    } else {
      if (voiceSynthesis) {
        voiceSynthesis.speak("Please provide a recipient and subject before sending");
      }
      
      toast({
        title: "Cannot Send Email",
        description: "Please provide both recipient and subject.",
        variant: "destructive"
      });
    }
  };

  // Function to read an email - defined before it's used in useEffect
  const readEmail = (email: Email) => {
    setCurrentEmail(email);
    
    // Mark as read in database
    db.markAsRead(email.id);
    
    // Update in local state too
    setEmails(prevEmails => 
      prevEmails.map(e => e.id === email.id ? { ...e, read: true } : e)
    );
    
    // Read aloud
    if (voiceSynthesis) {
      const emailText = `From: ${email.from}. Subject: ${email.subject}. ${email.body}`;
      voiceSynthesis.speak(emailText);
    }
  };

  // Function to delete an email - defined before it's used in useEffect
  const deleteEmail = (id: string) => {
    // Delete from db
    db.deleteEmail(id);
    
    // Remove from local state
    setEmails(prevEmails => prevEmails.filter(email => email.id !== id));
    
    // If current email is deleted, clear it
    if (currentEmail && currentEmail.id === id) {
      setCurrentEmail(null);
    }
    
    toast({
      title: "Email Deleted",
      description: "The email has been deleted."
    });
  };

  // Initialize voice services and load emails
  useEffect(() => {
    const recognition = new VoiceRecognitionService();
    const synthesis = new VoiceSynthesisService();
    
    setVoiceRecognition(recognition);
    setVoiceSynthesis(synthesis);
    
    // Set up recognition event handlers
    recognition.onStartListening(() => {
      setIsListening(true);
      
      // Clear interim transcript when starting to listen
      setInterimTranscript('');
    });
    
    recognition.onStopListening(() => {
      setIsListening(false);
    });
    
    recognition.onResult((result) => {
      setTranscript(result);
      console.log("Voice command recognized:", result);
      
      // Clear interim transcript after final result
      setInterimTranscript('');
    });
    
    recognition.onInterimResult((result) => {
      setInterimTranscript(result);
    });
    
    // Load initial emails
    const loadedEmails = db.getEmails();
    setEmails(loadedEmails);
    
    // Welcome message
    setTimeout(() => {
      if (synthesis) {
        synthesis.speak("Welcome to Talking Mailbox. Click the microphone button and try saying a command.");
      }
    }, 1000);
    
    // Clean up function
    return () => {
      recognition.stop();
      synthesis.stop();
    };
  }, []);

  // Set up voice commands when voiceRecognition is available
  useEffect(() => {
    if (!voiceRecognition || !voiceSynthesis) return;

    // Clear all previous commands to avoid duplicates
    voiceRecognition.clearCommands();

    // Command: Compose new email
    voiceRecognition.addCommand(/compose( new email)?( to (.+))?/i, (_, __, toMatch) => {
      const to = toMatch ? toMatch.trim() : '';
      setComposeMode(true);
      if (to) {
        setDraftEmail(prev => ({ ...prev, to }));
        voiceSynthesis.speak(`Creating new email to ${to}`);
        toast({
          title: "Recipient added",
          description: `Email to: ${to}`
        });
      } else {
        voiceSynthesis.speak("Creating new email. Say 'to' followed by the recipient name");
      }
    });

    // Enhanced command for setting recipient separately
    voiceRecognition.addCommand(/to (.+)/i, (_, recipient) => {
      const recipientName = recipient.trim();
      
      if (!composeMode) {
        setComposeMode(true);
        setDraftEmail(prev => ({ ...prev, to: recipientName }));
        voiceSynthesis.speak(`Creating new email to ${recipientName}`);
      } else {
        setDraftEmail(prev => ({ ...prev, to: recipientName }));
        voiceSynthesis.speak(`Recipient set to: ${recipientName}`);
      }
      
      toast({
        title: "Recipient added",
        description: `Email to: ${recipientName}`
      });
    });

    // Enhanced command for setting subject - FIXED to work in compose mode
    voiceRecognition.addCommand(/subject (.+)/i, (_, subject) => {
      if (composeMode) {
        const subjectText = subject.trim();
        setDraftEmail(prev => ({ ...prev, subject: subjectText }));
        voiceSynthesis.speak(`Subject set to: ${subjectText}`);
        toast({
          title: "Subject added",
          description: `Subject: ${subjectText}`
        });
      } else {
        setComposeMode(true);
        setTimeout(() => {
          const subjectText = subject.trim();
          setDraftEmail(prev => ({ ...prev, subject: subjectText }));
          voiceSynthesis.speak(`Created new email with subject: ${subjectText}`);
          toast({
            title: "New email with subject",
            description: `Subject: ${subjectText}`
          });
        }, 100);
      }
    });

    // Enhanced command for setting body/message with better handling - FIXED
    voiceRecognition.addCommand(/message (.+)|body (.+)/i, (_, message1, message2) => {
      if (composeMode) {
        const messageContent = (message1 || message2).trim();
        setDraftEmail(prev => ({ ...prev, body: messageContent }));
        voiceSynthesis.speak("Message body updated");
        toast({
          title: "Message added",
          description: "Email message has been updated"
        });
      } else {
        setComposeMode(true);
        setTimeout(() => {
          const messageContent = (message1 || message2).trim();
          setDraftEmail(prev => ({ ...prev, body: messageContent }));
          voiceSynthesis.speak("Created new email with message body");
          toast({
            title: "New email with message",
            description: "Email created with message body"
          });
        }, 100);
      }
    });

    // Command: Send email with more explicit feedback
    voiceRecognition.addCommand(/send( email)?/i, () => {
      if (composeMode) {
        if (!draftEmail.to) {
          voiceSynthesis.speak("Please specify a recipient first by saying 'to' followed by a name");
          toast({
            title: "Recipient needed",
            description: "Say 'to [name]' to add a recipient",
            variant: "destructive"
          });
          return;
        }
        
        if (!draftEmail.subject) {
          voiceSynthesis.speak("Please specify a subject first by saying 'subject' followed by your subject");
          toast({
            title: "Subject needed",
            description: "Say 'subject [text]' to add a subject",
            variant: "destructive"
          });
          return;
        }
        
        sendEmail();
      } else {
        voiceSynthesis.speak("No email to send. Please compose an email first.");
      }
    });

    // Command: Read emails or specific email
    voiceRecognition.addCommand(/read( latest| newest)?( email)?/i, () => {
      if (emails.length > 0) {
        // Sort by date descending and get the most recent
        const latestEmail = [...emails].sort((a, b) => 
          b.date.getTime() - a.date.getTime()
        )[0];
        
        readEmail(latestEmail);
      } else {
        voiceSynthesis.speak("You have no emails to read");
      }
    });

    // Command to read unread emails
    voiceRecognition.addCommand(/read unread( emails)?/i, () => {
      const unreadEmails = emails.filter(email => !email.read);
      if (unreadEmails.length > 0) {
        voiceSynthesis.speak(`You have ${unreadEmails.length} unread emails`);
        // Read the latest unread email
        const latestUnread = [...unreadEmails].sort((a, b) => 
          b.date.getTime() - a.date.getTime()
        )[0];
        readEmail(latestUnread);
      } else {
        voiceSynthesis.speak("You have no unread emails");
      }
    });

    // Command to read email from specific sender
    voiceRecognition.addCommand(/read email from (.+)/i, (_, sender) => {
      const senderEmails = emails.filter(email => 
        email.from.toLowerCase().includes(sender.toLowerCase())
      );
      
      if (senderEmails.length > 0) {
        const latestFromSender = [...senderEmails].sort((a, b) => 
          b.date.getTime() - a.date.getTime()
        )[0];
        
        readEmail(latestFromSender);
      } else {
        voiceSynthesis.speak(`No emails found from ${sender}`);
      }
    });

    // Command: Delete current email
    voiceRecognition.addCommand(/delete( this| current)?( email)?/i, () => {
      if (currentEmail) {
        deleteEmail(currentEmail.id);
        voiceSynthesis.speak("Email deleted");
      } else {
        voiceSynthesis.speak("No email selected");
      }
    });

    // Command: Go back to inbox
    voiceRecognition.addCommand(/inbox|go back/i, () => {
      setComposeMode(false);
      setCurrentEmail(null);
      voiceSynthesis.speak("Back to inbox");
    });

    // Command to count unread emails
    voiceRecognition.addCommand(/how many (unread )?emails/i, (_, unreadMatch) => {
      const checkUnread = !!unreadMatch;
      if (checkUnread) {
        const unreadCount = emails.filter(email => !email.read).length;
        voiceSynthesis.speak(`You have ${unreadCount} unread emails`);
      } else {
        voiceSynthesis.speak(`You have ${emails.length} total emails`);
      }
    });

    // Command: Stop listening
    voiceRecognition.addCommand(/stop listening/i, () => {
      voiceSynthesis.speak("Stopping voice recognition");
      voiceRecognition.stop();
    });

  }, [voiceRecognition, voiceSynthesis, composeMode, emails, currentEmail, draftEmail]);

  // Function to toggle voice recognition
  const toggleListening = () => {
    if (voiceRecognition) {
      if (isListening) {
        voiceRecognition.stop();
      } else {
        // Provide context-specific guidance when starting to listen
        if (composeMode) {
          toast({
            title: "Voice commands for composing",
            description: "Say 'to [name]', 'subject [text]', or 'message [text]'",
            duration: 4000,
          });
        }
        voiceRecognition.start();
      }
    }
  };

  const contextValue: VoiceMailContextType = {
    voiceRecognition,
    voiceSynthesis,
    isListening,
    transcript,
    interimTranscript,
    emails,
    currentEmail,
    setCurrentEmail,
    composeMode,
    setComposeMode,
    draftEmail,
    setDraftEmail,
    sendEmail,
    readEmail,
    deleteEmail,
    toggleListening
  };

  return (
    <VoiceMailContext.Provider value={contextValue}>
      {children}
    </VoiceMailContext.Provider>
  );
};

export const useVoiceMail = () => {
  const context = useContext(VoiceMailContext);
  
  if (context === undefined) {
    throw new Error('useVoiceMail must be used within a VoiceMailProvider');
  }
  
  return context;
};
