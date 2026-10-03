/**
 * =============================================================================
 * Root Layout — The App Shell
 * =============================================================================
 *
 * This is a SERVER component (no "use client" directive).
 * It runs once on the server and provides:
 *   1. HTML <head> metadata (title, description, fonts)
 *   2. The <AuthProvider> and <JournalProvider> that wrap all pages
 *
 * PROVIDER ORDER:
 * ──────────────
 * AuthProvider must wrap JournalProvider because JournalProvider needs
 * to call useAuth() to know whether to use localStorage or the API.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { JournalProvider } from "@/lib/journal-context";
import "./globals.css";

/**
 * Font optimization via next/font.
 * This automatically self-hosts the Inter font (no Google Fonts network request),
 * applies font-display: swap for better CLS, and prevents layout shift.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/**
 * SEO metadata — Next.js automatically renders these as <meta> tags.
 * This is a server-only feature (can't use useState for metadata).
 */
export const metadata: Metadata = {
  title: "COUCH CRITICS — Personal Movie & TV Journal",
  description:
    "Track episodes, curate your backlog, and analyze your viewing metrics. Your personal movie and TV show journal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-zinc-950 text-white font-sans">
        {/**
         * AuthProvider → JournalProvider → children
         * Auth must come first because JournalProvider reads auth state
         * to decide whether to use localStorage or the cloud API.
         */}
        <AuthProvider>
          <JournalProvider>{children}</JournalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
