
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

  // Initialize voice services and load emails
  useEffect(() => {
    const recognition = new VoiceRecognitionService();
    const synthesis = new VoiceSynthesisService();
    
    setVoiceRecognition(recognition);
    setVoiceSynthesis(synthesis);
    
    // Set up recognition event handlers
    recognition.onStartListening(() => {
      setIsListening(true);
      toast({ 
        title: "Voice Recognition Active",
        description: "I'm listening for commands now"
      });
    });
    
    recognition.onStopListening(() => {
      setIsListening(false);
    });
    
    recognition.onResult((result) => {
      setTranscript(result);
      console.log("Voice command received:", result);
    });
    
    recognition.onInterimResult((result) => {
      setInterimTranscript(result);
    });
    
    recognition.onError((error) => {
      console.error("Voice recognition error:", error);
      toast({
        title: "Voice Recognition Error",
        description: "There was a problem with voice recognition.",
        variant: "destructive"
      });
    });
    
    // Load initial emails
    const loadedEmails = db.getEmails();
    setEmails(loadedEmails);
    
    // Clean up function
    return () => {
      recognition.stop();
      synthesis.stop();
    };
  }, []);

  // Set up voice commands when voiceRecognition is available
  useEffect(() => {
    if (!voiceRecognition || !voiceSynthesis) return;

    // Command: Compose new email
    voiceRecognition.addCommand(/compose( new email)?( to (.+))?/i, (_, __, toMatch) => {
      const to = toMatch || '';
      setComposeMode(true);
      setDraftEmail(prev => ({ ...prev, to }));
      voiceSynthesis.speak("Creating new email" + (to ? ` to ${to}` : ""));
      
      toast({
        title: "New Email",
        description: `Creating new email${to ? ` to ${to}` : ""}`
      });
    });

    // Command: Set subject
    voiceRecognition.addCommand(/subject (.+)/i, (_, subject) => {
      if (composeMode) {
        setDraftEmail(prev => ({ ...prev, subject }));
        voiceSynthesis.speak(`Subject set to: ${subject}`);
        
        toast({
          title: "Subject Set",
          description: subject
        });
      } else {
        voiceSynthesis.speak("Please compose an email first before setting the subject");
        toast({
          title: "Action Not Available",
          description: "Please compose an email first",
          variant: "destructive"
        });
      }
    });

    // Command: Set body/message
    voiceRecognition.addCommand(/message (.+)|body (.+)/i, (_, message1, message2) => {
      if (composeMode) {
        const messageContent = message1 || message2;
        setDraftEmail(prev => ({ ...prev, body: messageContent }));
        voiceSynthesis.speak("Message body updated");
        
        toast({
          title: "Message Updated",
          description: "Email body has been updated"
        });
      } else {
        voiceSynthesis.speak("Please compose an email first before setting the message");
        toast({
          title: "Action Not Available",
          description: "Please compose an email first",
          variant: "destructive"
        });
      }
    });

    // Command: Send email
    voiceRecognition.addCommand(/send( email)?/i, () => {
      if (composeMode) {
        sendEmail();
      } else {
        voiceSynthesis.speak("No email to send. Please compose an email first.");
        toast({
          title: "No Email to Send",
          description: "Please compose an email first",
          variant: "destructive"
        });
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
        toast({
          title: "Reading Email",
          description: `From: ${latestEmail.from}`
        });
      } else {
        voiceSynthesis.speak("You have no emails to read");
        toast({
          title: "No Emails",
          description: "Your inbox is empty"
        });
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
        
        toast({
          title: "Reading Unread Email",
          description: `From: ${latestUnread.from}`
        });
      } else {
        voiceSynthesis.speak("You have no unread emails");
        toast({
          title: "No Unread Emails",
          description: "All emails have been read"
        });
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
        toast({
          title: `Email from ${sender}`,
          description: latestFromSender.subject
        });
      } else {
        voiceSynthesis.speak(`No emails found from ${sender}`);
        toast({
          title: "No Matching Emails",
          description: `No emails found from ${sender}`
        });
      }
    });

    // Command: Delete current email
    voiceRecognition.addCommand(/delete( this| current)?( email)?/i, () => {
      if (currentEmail) {
        deleteEmail(currentEmail.id);
        voiceSynthesis.speak("Email deleted");
      } else {
        voiceSynthesis.speak("No email selected");
        toast({
          title: "No Email Selected",
          description: "Please select an email first",
          variant: "destructive"
        });
      }
    });

    // Command: Go back to inbox
    voiceRecognition.addCommand(/inbox|go back/i, () => {
      setComposeMode(false);
      setCurrentEmail(null);
      voiceSynthesis.speak("Back to inbox");
      toast({
        title: "Inbox",
        description: "Viewing all emails"
      });
    });

    // Command to count unread emails
    voiceRecognition.addCommand(/how many (unread )?emails/i, (_, unreadMatch) => {
      const checkUnread = !!unreadMatch;
      if (checkUnread) {
        const unreadCount = emails.filter(email => !email.read).length;
        voiceSynthesis.speak(`You have ${unreadCount} unread emails`);
        toast({
          title: "Unread Count",
          description: `${unreadCount} unread emails`
        });
      } else {
        voiceSynthesis.speak(`You have ${emails.length} total emails`);
        toast({
          title: "Email Count",
          description: `${emails.length} total emails`
        });
      }
    });

    // Command: Search for emails
    voiceRecognition.addCommand(/search( for)? (.+)/i, (_, __, searchTerm) => {
      const results = emails.filter(email => 
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (results.length > 0) {
        voiceSynthesis.speak(`Found ${results.length} emails matching "${searchTerm}"`);
        toast({
          title: "Search Results",
          description: `${results.length} emails found for "${searchTerm}"`
        });
      } else {
        voiceSynthesis.speak(`No emails found matching "${searchTerm}"`);
        toast({
          title: "No Results",
          description: `No emails found for "${searchTerm}"`
        });
      }
    });

    // Command: Stop listening
    voiceRecognition.addCommand(/stop listening/i, () => {
      voiceSynthesis.speak("Stopping voice recognition");
      voiceRecognition.stop();
      toast({
        title: "Voice Recognition Stopped",
        description: "Click the microphone to start again"
      });
    });

    // Command: Mark as read/unread
    voiceRecognition.addCommand(/mark as (un)?read/i, (_, unreadMatch) => {
      if (currentEmail) {
        const isMarkingUnread = !!unreadMatch;
        if (isMarkingUnread) {
          // This would need a markAsUnread function in db
          // For now we'll just update in local state
          setEmails(prevEmails => 
            prevEmails.map(e => e.id === currentEmail.id ? { ...e, read: false } : e)
          );
          voiceSynthesis.speak("Email marked as unread");
          toast({
            title: "Marked as Unread",
            description: "Email has been marked as unread"
          });
        } else {
          db.markAsRead(currentEmail.id);
          setEmails(prevEmails => 
            prevEmails.map(e => e.id === currentEmail.id ? { ...e, read: true } : e)
          );
          voiceSynthesis.speak("Email marked as read");
          toast({
            title: "Marked as Read",
            description: "Email has been marked as read"
          });
        }
      } else {
        voiceSynthesis.speak("No email selected");
        toast({
          title: "No Email Selected",
          description: "Please select an email first"
        });
      }
    });

  }, [voiceRecognition, voiceSynthesis, composeMode, emails, currentEmail, sendEmail, deleteEmail, readEmail]);

  // Function to toggle voice recognition
  const toggleListening = () => {
    if (voiceRecognition) {
      voiceRecognition.toggle();
    }
  };

  // Function to send an email
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

  // Function to read an email
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

  // Function to delete an email
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
