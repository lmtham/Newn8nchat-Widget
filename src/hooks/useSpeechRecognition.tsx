import { useState, useRef, useEffect } from 'react';

interface UseSpeechRecognitionProps {
  onTranscription: (text: string) => void;
  onFinalTranscript: (text: string) => void;
}

export function useSpeechRecognition({ onTranscription, onFinalTranscript }: UseSpeechRecognitionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimestampRef = useRef<number>(0);
  const IDLE_TIMEOUT = 3000; // 3 seconds idle timeout

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRecording();
    };
  }, []);

  const cleanupRecording = () => {
    console.log('Cleaning up recording resources');
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.abort();
      speechRecognitionRef.current = null;
    }
  };

  // Check for silence periodically
  const startSilenceDetection = () => {
    console.log('Starting silence detection');
    lastSpeechTimestampRef.current = Date.now();
    
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current);
    }
    
    silenceTimerRef.current = setInterval(() => {
      const timeSinceLastSpeech = Date.now() - lastSpeechTimestampRef.current;
      console.log(`Time since last speech: ${timeSinceLastSpeech}ms`);
      
      if (timeSinceLastSpeech >= IDLE_TIMEOUT && isRecording) {
        console.log('Idle timeout reached, stopping recording');
        stopRecording();
      }
    }, 500); // Check every 500ms
  };

  const startRecording = async () => {
    try {
      cleanupRecording(); // Cleanup any existing recording session
      
      // Initialize Web Speech API
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        throw new Error("Speech recognition not supported in this browser");
      }
      
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      let finalTranscript = '';
      let interimTranscript = '';
      
      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
        setIsTranscribing(true);
        startSilenceDetection();
      };
      
      recognition.onresult = (event) => {
        interimTranscript = '';
        lastSpeechTimestampRef.current = Date.now(); // Update last speech timestamp
        console.log('Speech detected, resetting idle timer');
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update with current transcription
        onTranscription(finalTranscript || interimTranscript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        cleanupRecording();
        setIsRecording(false);
        setIsTranscribing(false);
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        cleanupRecording();
        setIsRecording(false);
        setIsTranscribing(false);
        
        // Send final transcript if available
        if (finalTranscript.trim()) {
          onFinalTranscript(finalTranscript.trim());
        }
      };
      
      // Start recognition
      recognition.start();
      speechRecognitionRef.current = recognition;
      
    } catch (error) {
      console.error('Error starting recording:', error);
      cleanupRecording();
      setIsRecording(false);
      setIsTranscribing(false);
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording');
    cleanupRecording();
    
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    
    setIsRecording(false);
    setIsTranscribing(false);
  };

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording
  };
}
