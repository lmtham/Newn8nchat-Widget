import React from 'react';
import { X, RefreshCw } from 'lucide-react';

interface ChatHeaderProps {
  handleClose: () => void;
  handleReset: () => void;
  title: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ handleClose, handleReset, title }) => {
  return (
    <div className="chat-widget-header">
      <div className="chat-widget-title">{title}</div>
      <div className="chat-widget-controls">
        <RefreshCw 
          className="chat-widget-control-icon" 
          onClick={handleReset}
          style={{ cursor: 'pointer' }}
        />
        <X className="chat-widget-control-icon" onClick={handleClose} />
      </div>
    </div>
  );
};

export default ChatHeader;
