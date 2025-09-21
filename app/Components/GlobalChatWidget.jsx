"use client";
import { useChat } from "./ChatContext";
import ChatWidget from "./ChatWidget";

export default function GlobalChatWidget() {
  const { isChatOpen, toggleChat } = useChat();

  return (
    <ChatWidget
      isOpen={isChatOpen}
      onToggle={toggleChat}
      title="AI Assistant"
      placeholder="Ask me anything..."
    />
  );
}
