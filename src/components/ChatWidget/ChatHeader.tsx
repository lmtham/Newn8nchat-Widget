import React from 'react';
import { X, RefreshCw, User } from 'lucide-react';

interface ChatHeaderProps {
  handleClose: () => void;
  handleReset: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ handleClose, handleReset }) => {
  return (
    <div className="chat-widget-header">
      <div className="chat-widget-title">Chat Widget</div>
      <div className="chat-widget-controls">
        <User className="chat-widget-control-icon" />
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
