import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from './components/ChatWidget/ChatWidget';
import { Toaster } from './components/ui/toaster';

interface ChatWidgetConfig {
  webhookUrl: string;
  headerTitle?: string;
  botName?: string;
  welcomeMessage?: string;
}

declare global {
  interface Window {
    initChatWidget: (config: ChatWidgetConfig) => void;
  }
}

// Initialize the chat widget with configuration
window.initChatWidget = (config: ChatWidgetConfig) => {
  const root = document.createElement('div');
  root.id = 'chat-widget-root';
  document.body.appendChild(root);

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ChatWidget 
        n8nWebhookURL={config.webhookUrl}
        headerTitle={config.headerTitle}
        botName={config.botName}
        welcomeMessage={config.welcomeMessage}
      />
      <Toaster />
    </React.StrictMode>
  );
};
