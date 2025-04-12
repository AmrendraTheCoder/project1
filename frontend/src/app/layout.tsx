import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LNMIIT_Rating",
  description: "Let's see",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} min-h-screen bg-slate-50 font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
