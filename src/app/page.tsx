/**
 * =============================================================================
 * Home Page — Entry Point
 * =============================================================================
 *
 * This is a Server Component that simply renders the Dashboard.
 *
 * WHY IS THIS FILE SO SMALL?
 * ──────────────────────────
 * In Next.js App Router, page.tsx is the "entry point" for a route.
 * All the interactive logic lives in <Dashboard/> (a Client Component).
 *
 * Keeping page.tsx minimal follows the "Thin Controller" pattern:
 * the page decides WHAT to render, the component decides HOW.
 *
 * Later, you could add multiple pages:
 *   - /movie/[id]/page.tsx → Movie detail page
 *   - /settings/page.tsx → User settings
 *   - /export/page.tsx → Export data as JSON/CSV
 */

import Dashboard from "@/components/Dashboard";

export default function HomePage() {
  return <Dashboard />;
}
