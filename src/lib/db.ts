
// Mock database using localStorage for emails
export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  read: boolean;
  date: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

const STORAGE_KEY = "voice_mail_wizard_data";
const DEFAULT_USER: User = {
  id: "1",
  name: "User",
  email: "user@example.com"
};

const SAMPLE_EMAILS: Email[] = [
  {
    id: "1",
    from: "john@example.com",
    to: DEFAULT_USER.email,
    subject: "Welcome to Voice Mail Wizard",
    body: "Hi there! Welcome to Voice Mail Wizard. You can use voice commands like 'compose', 'read', 'send', and more to interact with your emails.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60)
  },
  {
    id: "2",
    from: "sarah@example.com",
    to: DEFAULT_USER.email,
    subject: "Voice Command Tips",
    body: "Try saying 'read latest email' or 'compose new email to Sarah' to see how voice commands work!",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: "3",
    from: "tech@example.com",
    to: DEFAULT_USER.email,
    subject: "Your Voice Mail Account",
    body: "Your voice-controlled email account has been created successfully. Enjoy using our service!",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24)
  }
];

export const db = {
  getUser: (): User => {
    return DEFAULT_USER;
  },
  
  getEmails: (): Email[] => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const data = JSON.parse(storedData);
      // Convert date strings back to Date objects
      return data.map((email: any) => ({
        ...email,
        date: new Date(email.date)
      }));
    } else {
      // Initialize with sample data on first load
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_EMAILS));
      return SAMPLE_EMAILS;
    }
  },
  
  addEmail: (email: Omit<Email, "id" | "date" | "read">): Email => {
    const emails = db.getEmails();
    const newEmail: Email = {
      ...email,
      id: `${Date.now()}`,
      date: new Date(),
      read: false
    };
    
    const updatedEmails = [...emails, newEmail];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEmails));
    return newEmail;
  },
  
  markAsRead: (id: string): void => {
    const emails = db.getEmails();
    const updatedEmails = emails.map(email => 
      email.id === id ? { ...email, read: true } : email
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEmails));
  },
  
  deleteEmail: (id: string): void => {
    const emails = db.getEmails();
    const updatedEmails = emails.filter(email => email.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEmails));
  }
};
