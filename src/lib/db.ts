
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
  },
  {
    id: "9",
    from: "ananya@example.com",
    to: DEFAULT_USER.email,
    subject: "New AI Research Paper",
    body: "I came across this fascinating research paper on voice recognition algorithms that I thought might interest you. The authors propose a novel approach that could significantly improve accuracy in noisy environments.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 12)
  },
  {
    id: "10",
    from: "vikram@example.com",
    to: DEFAULT_USER.email,
    subject: "Monthly Team Report",
    body: "Please find attached the monthly team performance report. Our voice recognition module has shown a 12% improvement in accuracy over the last month. Great work by everyone involved!",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 30)
  },
  {
    id: "11",
    from: "neha@example.com",
    to: DEFAULT_USER.email,
    subject: "Coffee Chat?",
    body: "It's been a while since we caught up properly. Would you be available for a coffee chat next week to discuss the progress on the voice assistant project?",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 15)
  },
  {
    id: "12",
    from: "arjun@example.com",
    to: DEFAULT_USER.email,
    subject: "Voice Assistant Demo",
    body: "The demo for our voice assistant went really well! The clients were impressed with the natural language processing capabilities. They'd like to schedule a follow-up meeting next month.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 38)
  },
  {
    id: "13",
    from: "kavitha@example.com",
    to: DEFAULT_USER.email,
    subject: "Vacation Plans",
    body: "Just letting you know I'll be on vacation next week. I've completed all my pending tasks and documented everything for the team. Please reach out if there's anything urgent.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: "14",
    from: "rohan@example.com",
    to: DEFAULT_USER.email,
    subject: "Conference Invitation",
    body: "You're invited to speak at the upcoming Voice Technology Conference in Bangalore next month. Would you be interested in presenting our latest work on voice-controlled interfaces?",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48 * 3)
  },
  {
    id: "15",
    from: "anjali@example.com",
    to: DEFAULT_USER.email,
    subject: "UX Research Findings",
    body: "Our recent user testing sessions have yielded interesting insights about how people interact with voice commands. I've attached a summary report for your review.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 72 * 2)
  },
  {
    id: "16",
    from: "deepak@example.com",
    to: DEFAULT_USER.email,
    subject: "Code Review Request",
    body: "Could you please review the pull request for the speech recognition module? I've implemented the improvements we discussed in the last meeting.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 96 * 1.5)
  },
  {
    id: "17",
    from: "meera@example.com",
    to: DEFAULT_USER.email,
    subject: "Product Roadmap",
    body: "I've updated our product roadmap for the next quarter. Voice features are now prioritized, and we'll be focusing on improving the natural language understanding capabilities.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 120)
  },
  {
    id: "18",
    from: "venkat@example.com",
    to: DEFAULT_USER.email,
    subject: "Budget Approval",
    body: "The budget for the voice recognition research has been approved! We can now proceed with acquiring the additional hardware and software resources we discussed.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 36)
  },
  {
    id: "19",
    from: "shalini@example.com",
    to: DEFAULT_USER.email,
    subject: "New Voice Dataset",
    body: "We've collected a diverse set of voice samples that can be used to improve our recognition algorithms. The dataset includes various Indian accents and dialects.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48)
  },
  {
    id: "20",
    from: "aditya@example.com",
    to: DEFAULT_USER.email,
    subject: "Weekly Team Update",
    body: "Here's a summary of what the team accomplished this week: improved voice command accuracy by 8%, reduced latency by 15ms, and added support for three new Indian languages.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 78)
  },
  {
    id: "21",
    from: "lakshmi@example.com",
    to: DEFAULT_USER.email,
    subject: "Accessibility Features",
    body: "I've been researching ways to make our voice interface more accessible. I have some suggestions that could benefit users with different abilities and needs.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 100)
  },
  {
    id: "22",
    from: "ramesh@example.com",
    to: DEFAULT_USER.email,
    subject: "Patent Filing Update",
    body: "Our patent application for the novel voice recognition algorithm has been accepted for review. The legal team estimates we should hear back within 3-4 months.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 125)
  },
  {
    id: "23",
    from: "shreya@example.com",
    to: DEFAULT_USER.email,
    subject: "Customer Feedback Summary",
    body: "I've analyzed the customer feedback from the beta test. Users are particularly impressed with the voice command accuracy and natural responses. There are some suggestions for additional commands.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 27)
  },
  {
    id: "24",
    from: "karthik@example.com",
    to: DEFAULT_USER.email,
    subject: "Integration Testing Results",
    body: "The integration tests for the voice module with the main application have been completed. All critical paths are working as expected, with only minor issues that I'm currently addressing.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 33)
  },
  {
    id: "25",
    from: "nandita@example.com",
    to: DEFAULT_USER.email,
    subject: "Design System Update",
    body: "We've updated our design system to include new components specifically for voice interaction feedback. This should make it easier to provide visual cues during voice interactions.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 50)
  },
  {
    id: "26",
    from: "prakash@example.com",
    to: DEFAULT_USER.email,
    subject: "Security Review",
    body: "The security team has completed their review of the voice authentication feature. They've provided some recommendations to enhance the security of voice data transmission.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 65)
  },
  {
    id: "27",
    from: "sarika@example.com",
    to: DEFAULT_USER.email,
    subject: "Marketing Materials",
    body: "The marketing team has created new promotional materials highlighting our voice-controlled features. I've attached the drafts for your review before we finalize them.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 80)
  },
  {
    id: "28",
    from: "krishna@example.com",
    to: DEFAULT_USER.email,
    subject: "Algorithm Optimization",
    body: "I've optimized the speech-to-text algorithm, resulting in a 23% improvement in processing speed without sacrificing accuracy. The changes are ready for code review.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 92)
  },
  {
    id: "29",
    from: "parvati@example.com",
    to: DEFAULT_USER.email,
    subject: "User Manual Draft",
    body: "I've completed the first draft of the user manual focusing on voice commands. Could you review it to ensure all commands are accurately described and the instructions are clear?",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 110)
  },
  {
    id: "30",
    from: "govind@example.com",
    to: DEFAULT_USER.email,
    subject: "Server Infrastructure",
    body: "We need to upgrade our server infrastructure to handle the increased load from voice processing. I've prepared a proposal with different options and their cost implications.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 130)
  },
  {
    id: "31",
    from: "tanvi@example.com",
    to: DEFAULT_USER.email,
    subject: "Workshop Invitation",
    body: "We're hosting a workshop on advanced voice recognition techniques next month. Would you like to conduct a session on implementing voice commands in web applications?",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 140)
  },
  {
    id: "32",
    from: "rajiv@example.com",
    to: DEFAULT_USER.email,
    subject: "Quarterly Business Review",
    body: "The QBR is scheduled for next Thursday. Please prepare a summary of your team's achievements, especially highlighting the improvements in the voice recognition system.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 150)
  },
  {
    id: "33",
    from: "geeta@example.com",
    to: DEFAULT_USER.email,
    subject: "Localization Progress",
    body: "We've completed the localization of voice commands for Hindi, Tamil, and Bengali. Initial testing shows good recognition rates across different accents.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 160)
  },
  {
    id: "34",
    from: "nirmal@example.com",
    to: DEFAULT_USER.email,
    subject: "Vendor Evaluation",
    body: "I've evaluated three potential vendors for the specialized voice processing hardware. A comparison chart is attached, along with my recommendations.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 170)
  },
  {
    id: "35",
    from: "pooja@example.com",
    to: DEFAULT_USER.email,
    subject: "Team Building Event",
    body: "We're planning a team building event next month. Please fill out the preference form to help us choose activities that everyone will enjoy.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 180)
  },
  {
    id: "36",
    from: "varun@example.com",
    to: DEFAULT_USER.email,
    subject: "Performance Optimization",
    body: "After analyzing the system performance, I've identified several opportunities to optimize the voice processing pipeline. Let's discuss these in our next technical meeting.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 190)
  },
  {
    id: "37",
    from: "ritu@example.com",
    to: DEFAULT_USER.email,
    subject: "Client Demo Preparation",
    body: "We have a demo scheduled with an important client next week. Let's ensure the voice features are working flawlessly. I've scheduled a rehearsal for Monday.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 200)
  },
  {
    id: "38",
    from: "sanjay@example.com",
    to: DEFAULT_USER.email,
    subject: "Innovation Award Nomination",
    body: "I've nominated our voice recognition project for the annual Innovation Award. The judging panel will visit next month for a live demonstration.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 210)
  },
  {
    id: "39",
    from: "anand@example.com",
    to: DEFAULT_USER.email,
    subject: "Research Collaboration",
    body: "A professor from IIT Delhi has reached out about potential collaboration on advanced voice recognition research. This could be a great opportunity for knowledge exchange.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 220)
  },
  {
    id: "40",
    from: "leela@example.com",
    to: DEFAULT_USER.email,
    subject: "Quality Assurance Results",
    body: "The QA team has completed testing of the latest voice features. Overall results are positive, with a few minor issues documented in the attached report.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 230)
  },
  {
    id: "41",
    from: "vivek@example.com",
    to: DEFAULT_USER.email,
    subject: "Resource Allocation",
    body: "Based on the updated project plan, I've reallocated resources to prioritize the voice recognition enhancements. Please review the new allocation and let me know if you have concerns.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 240)
  },
  {
    id: "42",
    from: "shweta@example.com",
    to: DEFAULT_USER.email,
    subject: "Documentation Update",
    body: "I've updated the technical documentation with details about the new voice command protocol. Please review it when you get a chance.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 250)
  },
  {
    id: "43",
    from: "ajay@example.com",
    to: DEFAULT_USER.email,
    subject: "Mobile App Integration",
    body: "The voice features have been successfully integrated into the mobile app. We're now in the testing phase before the public beta release next month.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 260)
  },
  {
    id: "44",
    from: "manisha@example.com",
    to: DEFAULT_USER.email,
    subject: "Training Program",
    body: "We're organizing a training program on voice interface design principles. Would you be interested in participating or perhaps contributing as a speaker?",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 270)
  },
  {
    id: "45",
    from: "aditi@example.com",
    to: DEFAULT_USER.email,
    subject: "Voice Authentication Feature",
    body: "The voice authentication prototype is ready for internal testing. Initial results show a 95% accuracy rate, which is promising. We'd like to get more team members involved in testing.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 280)
  },
  {
    id: "46",
    from: "gaurav@example.com",
    to: DEFAULT_USER.email,
    subject: "Cloud Migration Plan",
    body: "I've finalized the migration plan to move our voice processing services to the cloud. This should improve scalability and reduce operational costs in the long run.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 290)
  },
  {
    id: "47",
    from: "suresh@example.com",
    to: DEFAULT_USER.email,
    subject: "Accessibility Audit Results",
    body: "The accessibility audit of our voice interface has been completed. We scored well overall, with some recommendations for improvements to better serve users with speech impairments.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 300)
  },
  {
    id: "48",
    from: "dhruv@example.com",
    to: DEFAULT_USER.email,
    subject: "Competitive Analysis",
    body: "I've completed a competitive analysis of voice-controlled email clients in the market. Our solution has several unique advantages that we should highlight in our marketing materials.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 310)
  },
  {
    id: "49",
    from: "komal@example.com",
    to: DEFAULT_USER.email,
    subject: "New Feature Suggestion",
    body: "I've been thinking about adding contextual voice commands that adapt based on the user's previous interactions. This could significantly enhance the user experience. Let's discuss this idea.",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 320)
  },
  {
    id: "50",
    from: "naveen@example.com",
    to: DEFAULT_USER.email,
    subject: "Project Timeline Update",
    body: "Based on our recent progress with the voice features, I've updated the project timeline. We're currently ahead of schedule, which gives us room to add some of the stretch goal features.",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 330)
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
