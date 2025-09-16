"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: "m1",
      role: "assistant",
      content: "Hi! I’m here to help. How can I support you today?",
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
        const assistantText = data?.reply ?? "I’m here and listening.";
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
          content: "I couldn’t reach the server. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto min-w-2xl">
      <header className="space-y-2 mb-4">
        <h1 className="text-3xl md:text-4xl font-semibold">Chat</h1>
        <p className="text-gray-600">
          A calm space to talk. Your messages are private on this device.
        </p>
      </header>

      <div className="card p-0 overflow-hidden">
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-4 space-y-4 bg-white"
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
        <form
          onSubmit={sendMessage}
          className="border-t border-black/5 p-3 bg-white"
        >
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 resize-none rounded-xl border border-gray-200 p-3 outline-none focus:border-[#d9b491] focus:ring-0"
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
              className="btn btn-primary ring-focus disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-9 h-9 rounded-xl grid place-items-center bg-[#fff5ec] text-gray-800">
          🧘
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-[#e6cdb5] text-gray-900"
            : "bg-gray-50 text-gray-800 border border-gray-200"
        }`}
      >
        {content}
      </div>
      {isUser && (
        <div className="w-9 h-9 rounded-xl grid place-items-center bg-gray-100 text-gray-700">
          😊
        </div>
      )}
    </div>
  );
}
