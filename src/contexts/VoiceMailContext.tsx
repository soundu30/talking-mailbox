
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
    });
    
    recognition.onStopListening(() => {
      setIsListening(false);
    });
    
    recognition.onResult((result) => {
      setTranscript(result);
    });
    
    recognition.onInterimResult((result) => {
      setInterimTranscript(result);
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
    });

    // Command: Set subject
    voiceRecognition.addCommand(/subject (.+)/i, (_, subject) => {
      if (composeMode) {
        setDraftEmail(prev => ({ ...prev, subject }));
        voiceSynthesis.speak(`Subject set to: ${subject}`);
      }
    });

    // Command: Set body/message
    voiceRecognition.addCommand(/message (.+)|body (.+)/i, (_, message1, message2) => {
      if (composeMode) {
        const messageContent = message1 || message2;
        setDraftEmail(prev => ({ ...prev, body: messageContent }));
        voiceSynthesis.speak("Message body updated");
      }
    });

    // Command: Send email
    voiceRecognition.addCommand(/send( email)?/i, () => {
      if (composeMode) {
        sendEmail();
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

    // Command: Stop listening
    voiceRecognition.addCommand(/stop listening/i, () => {
      voiceSynthesis.speak("Stopping voice recognition");
      voiceRecognition.stop();
    });

  }, [voiceRecognition, voiceSynthesis, composeMode, emails, currentEmail]);

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
