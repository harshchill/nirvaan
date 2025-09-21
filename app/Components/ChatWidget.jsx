"use client";
import { useEffect, useRef, useState } from "react";

export default function ChatWidget({ 
  isOpen = false, 
  onToggle, 
  className = "",
  title = "Chat Assistant",
  placeholder = "Type your message…"
}) {
  const [messages, setMessages] = useState([
    {
      id: "m1",
      role: "assistant",
      content: "Hi! I'm here to help. How can I support you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef(null);

  const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL;

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMsg = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      if (chatApiUrl) {
        const res = await fetch(chatApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 500,
          }),
        });
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        const assistantText = data?.reply ?? "I'm here and listening.";
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: assistantText,
          },
        ]);
      } else {
        // Friendly placeholder when backend isn't configured
        await new Promise((r) => setTimeout(r, 500));
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "This is a demo response. Connect your backend via NEXT_PUBLIC_CHAT_API_URL to enable live replies.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I couldn't reach the server. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="w-14 h-14 bg-[#d9b491] hover:bg-[#c4a67a] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          aria-label="Open chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#fff5ec] flex items-center justify-center">
                🧘
              </div>
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <button
              onClick={onToggle}
              className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-white"
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
            ))}
            {isSending && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                Thinking…
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={sendMessage}
            className="border-t border-gray-200 p-3 bg-white rounded-b-lg"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-[#d9b491] focus:ring-0"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="px-3 py-2 bg-[#d9b491] hover:bg-[#c4a67a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  
  // Parse and format the content
  const formatContent = (text) => {
    if (isUser) {
      // For user messages, just return plain text
      return <span>{text}</span>;
    }
    
    // For AI responses, parse markdown and formatting
    return parseAIResponse(text);
  };
  
  return (
    <div
      className={`flex items-start gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-[#fff5ec] flex items-center justify-center text-xs">
          🧘
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
          isUser
            ? "bg-[#e6cdb5] text-gray-900"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {formatContent(content)}
      </div>
      {isUser && (
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
          😊
        </div>
      )}
    </div>
  );
}

function parseAIResponse(text) {
  // First, split by both \n\n and \n to handle different formats
  const lines = text.split(/\n/);
  const processedLines = [];
  
  // Process each line
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      // Add empty line as separator
      processedLines.push({ type: 'separator', content: '' });
      continue;
    }
    
    // Check if it's a numbered list item
    if (trimmedLine.match(/^\d+\.\s/)) {
      processedLines.push({ type: 'numbered', content: trimmedLine });
    }
    // Check if it contains bold text (**text**)
    else if (trimmedLine.includes('**')) {
      processedLines.push({ type: 'bold', content: trimmedLine });
    }
    // Check if it's a question
    else if (trimmedLine.endsWith('?') && !trimmedLine.includes('**')) {
      processedLines.push({ type: 'question', content: trimmedLine });
    }
    // Regular text
    else {
      processedLines.push({ type: 'regular', content: trimmedLine });
    }
  }
  
  return (
    <div className="space-y-3">
      {processedLines.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className="h-3" />;
        }
        
        switch (item.type) {
          case 'numbered':
            return <NumberedListItem key={index} text={item.content} />;
          case 'bold':
            return <BoldText key={index} text={item.content} />;
          case 'question':
            return <QuestionText key={index} text={item.content} />;
          default:
            return <RegularText key={index} text={item.content} />;
        }
      })}
    </div>
  );
}

function NumberedListItem({ text }) {
  // Extract number and content - handle both "1. **Bold**" and "1. Text" formats
  const match = text.match(/^(\d+)\.\s(.+)$/);
  if (!match) return <RegularText text={text} />;
  
  const [, number, content] = match;
  
  // Parse bold text in the content
  const formattedContent = parseBoldText(content);
  
  return (
    <div className="flex gap-3 items-start mb-2">
      <span className="flex-shrink-0 w-6 h-6 bg-[#d9b491] text-white rounded-full flex items-center justify-center text-xs font-semibold">
        {number}
      </span>
      <div className="flex-1 text-gray-800 leading-relaxed">{formattedContent}</div>
    </div>
  );
}

function BoldText({ text }) {
  const formattedText = parseBoldText(text);
  return (
    <div className="font-medium text-gray-900">
      {formattedText}
    </div>
  );
}

function QuestionText({ text }) {
  return (
    <div className="text-[#d9b491] font-medium">
      {text}
    </div>
  );
}

function RegularText({ text }) {
  const formattedText = parseBoldText(text);
  return <div>{formattedText}</div>;
}

function parseBoldText(text) {
  // Parse **bold** text and other markdown-like formatting
  const parts = text.split(/(\*\*.*?\*\*)/);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold text-gray-900">
          {boldText}
        </strong>
      );
    }
    
    // Handle emojis and special characters
    if (part.includes(';)') || part.includes(':)')) {
      return (
        <span key={index} className="text-[#d9b491]">
          {part}
        </span>
      );
    }
    
    return <span key={index}>{part}</span>;
  });
}
