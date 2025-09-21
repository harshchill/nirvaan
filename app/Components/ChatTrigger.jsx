"use client";
import { useChat } from "./ChatContext";

export default function ChatTrigger({ 
  children, 
  className = "btn btn-primary",
  text = "Chat with AI"
}) {
  const { openChat } = useChat();

  return (
    <button onClick={openChat} className={className}>
      {children || text}
    </button>
  );
}
