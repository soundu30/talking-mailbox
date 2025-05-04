
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
    from: "monish@example.com",
    to: DEFAULT_USER.email,
    subject: "Welcome to Voice Mail Wizard",
    body: "Hi there! Welcome to Voice Mail Wizard. You can use voice commands like 'compose', 'read', 'send', and more to interact with your emails.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60)
  },
  {
    id: "2",
    from: "subash@example.com",
    to: DEFAULT_USER.email,
    subject: "Voice Command Tips",
    body: "Try saying 'read latest email' or 'compose new email to Subash' to see how voice commands work!",
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
  },
  {
    id: "4",
    from: "soundarya@example.com",
    to: DEFAULT_USER.email,
    subject: "Project Updates",
    body: "Hello, I wanted to share some updates about our current project. We've made significant progress on the voice recognition features, and I think you'll be pleased with the results. Let's schedule a meeting to discuss the details further.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 5)
  },
  {
    id: "5",
    from: "yukesh@example.com",
    to: DEFAULT_USER.email,
    subject: "Team Lunch Next Week",
    body: "Hi there! I'm organizing a team lunch next week to celebrate our recent successes. Would you be available on Tuesday at 1 PM? Let me know your preferences for the restaurant.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 10)
  },
  {
    id: "6",
    from: "priya@example.com",
    to: DEFAULT_USER.email,
    subject: "Document Review Request",
    body: "Could you please review the attached document when you have a moment? I need your feedback before the end of the week. Thank you!",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48)
  },
  {
    id: "7",
    from: "raj@example.com",
    to: DEFAULT_USER.email,
    subject: "API Integration Question",
    body: "I have a question about integrating the voice recognition API with our existing system. Are there any specific configuration parameters we need to consider? I'd appreciate your insights.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 72)
  },
  {
    id: "8",
    from: "divya@example.com",
    to: DEFAULT_USER.email,
    subject: "Weekend Hackathon",
    body: "We're organizing a hackathon this weekend focused on voice-controlled applications. Would you be interested in participating or perhaps serving as a mentor? It would be a great opportunity to showcase your expertise!",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 96)
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
