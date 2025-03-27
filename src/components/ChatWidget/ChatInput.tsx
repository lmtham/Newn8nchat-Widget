import React, { useEffect, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  sendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  isRecording,
  startRecording,
  stopRecording,
  sendMessage,
  handleKeyDown,
  disabled = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to the end of the textarea when text changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [inputText]);

  return (
    <div className="chat-widget-input">
      <div className="chat-widget-input-container">
        {isRecording ? (
          <button 
            className="chat-widget-mic-button recording" 
            onClick={stopRecording}
            aria-label="Stop recording"
            disabled={disabled}
          >
            <MicOff size={18} />
          </button>
        ) : (
          <button 
            className="chat-widget-mic-button"
            onClick={startRecording}
            aria-label="Start recording"
            disabled={disabled}
          >
            <Mic size={18} />
          </button>
        )}
        <textarea
          ref={textareaRef}
          placeholder={disabled ? "Waiting for response..." : "Type your message..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRecording || disabled}
          rows={1}
          className="chat-widget-input-textarea"
        />
        <button 
          className="chat-widget-send-button"
          onClick={sendMessage}
          disabled={!inputText.trim() || isRecording || disabled}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
