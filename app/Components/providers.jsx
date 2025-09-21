"use client";
import { SessionProvider } from "next-auth/react";
import { ChatProvider } from "./ChatContext";
import { BookingProvider } from "./BookingContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ChatProvider>
        <BookingProvider>{children}</BookingProvider>
      </ChatProvider>
    </SessionProvider>
  );
}


