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
import { ThemeProvider } from "@/lib/theme-context";
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
  referrer: "no-referrer",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <meta name="referrer" content="no-referrer" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('couch_critics_theme')||'dark';document.documentElement.setAttribute('data-theme',t);if(t==='light'){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans transition-colors duration-200">
        {/**
         * ThemeProvider → AuthProvider → JournalProvider → children
         */}
        <ThemeProvider>
          <AuthProvider>
            <JournalProvider>{children}</JournalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
