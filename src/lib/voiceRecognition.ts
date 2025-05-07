
// Voice recognition service
type CommandCallback = (command: string, ...args: string[]) => void;

interface VoiceCommand {
  pattern: RegExp;
  action: CommandCallback;
}

export class VoiceRecognitionService {
  private recognition: any = null; // Changed from SpeechRecognition to any
  private isListening: boolean = false;
  private commands: VoiceCommand[] = [];
  private onStartListeningCallbacks: (() => void)[] = [];
  private onStopListeningCallbacks: (() => void)[] = [];
  private onResultCallbacks: ((result: string) => void)[] = [];
  private onInterimResultCallbacks: ((result: string) => void)[] = [];
  private onErrorCallbacks: ((error: any) => void)[] = [];
  
  constructor() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Changed to avoid TypeScript errors
      const SpeechRecognitionAPI: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      
      this.setupRecognitionEventListeners();
    } else {
      console.error('Speech recognition not supported in this browser');
    }
  }
  
  private setupRecognitionEventListeners() {
    if (!this.recognition) return;
    
    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStartListeningCallbacks.forEach(callback => callback());
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      this.onStopListeningCallbacks.forEach(callback => callback());
    };
    
    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcription = result[0].transcript.trim().toLowerCase();
      
      if (result.isFinal) {
        this.onResultCallbacks.forEach(callback => callback(transcription));
        this.processCommand(transcription);
      } else {
        this.onInterimResultCallbacks.forEach(callback => callback(transcription));
      }
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      this.onErrorCallbacks.forEach(callback => callback(event));
    };
  }
  
  start() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }
  
  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }
  
  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }
  
  addCommand(pattern: RegExp, action: CommandCallback) {
    this.commands.push({ pattern, action });
  }
  
  clearCommands() {
    this.commands = [];
  }
  
  private processCommand(text: string) {
    for (const command of this.commands) {
      const match = text.match(command.pattern);
      if (match) {
        const [fullMatch, ...args] = match;
        command.action(fullMatch, ...args);
        return;
      }
    }
  }
  
  onStartListening(callback: () => void) {
    this.onStartListeningCallbacks.push(callback);
  }
  
  onStopListening(callback: () => void) {
    this.onStopListeningCallbacks.push(callback);
  }
  
  onResult(callback: (result: string) => void) {
    this.onResultCallbacks.push(callback);
  }
  
  onInterimResult(callback: (result: string) => void) {
    this.onInterimResultCallbacks.push(callback);
  }
  
  onError(callback: (error: any) => void) {
    this.onErrorCallbacks.push(callback);
  }
  
  isSupported(): boolean {
    return !!this.recognition;
  }
}

// Setup voice synthesis for responses
export class VoiceSynthesisService {
  private synth: SpeechSynthesis;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string, rate: number = 1, pitch: number = 1) {
    if (!this.synth) {
      console.error("Speech synthesis not supported");
      return;
    }
    
    // Cancel any ongoing speech
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  isPaused(): boolean {
    return this.synth.paused;
  }

  isPlaying(): boolean {
    return this.synth.speaking;
  }
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
