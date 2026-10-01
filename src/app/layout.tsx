/**
 * =============================================================================
 * Root Layout — The App Shell
 * =============================================================================
 *
 * This is a SERVER component (no "use client" directive).
 * It runs once on the server and provides:
 *   1. HTML <head> metadata (title, description, fonts)
 *   2. The <JournalProvider> that wraps all pages
 *
 * WHY WRAP PROVIDER HERE INSTEAD OF IN page.tsx?
 * ──────────────────────────────────────────────
 * The layout persists across page navigations. If you put the provider
 * in page.tsx, it would remount (and lose state) on every route change.
 * Layout is the correct place for app-wide providers.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
  title: "Cinema Journal — Your Personal Movie Portfolio",
  description:
    "Track what you're watching, curate your backlog, and keep a personal archive of every movie and show you experience. Powered by TMDB.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-zinc-950 text-white font-sans">
        {/**
         * JournalProvider is a Client Component being used inside a
         * Server Component. This is perfectly fine — Next.js handles
         * the boundary automatically. The children (page.tsx content)
         * will be rendered inside the provider.
         */}
        <JournalProvider>{children}</JournalProvider>
      </body>
    </html>
  );
}
