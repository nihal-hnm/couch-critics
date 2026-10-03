/**
 * GET /api/health — Simple health-check endpoint
 */
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "cinema-journal",
  });
}
