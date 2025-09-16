import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "./ui/SiteHeader";
import SiteFooter from "./ui/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nirvaan – Student Wellbeing",
  description: "Warm, modern mental health companion for students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> 
        <div className="min-h-dvh flex flex-col">
          <SiteHeader />
          <main className="flex-1 container-max py-10">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
