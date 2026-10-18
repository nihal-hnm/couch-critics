import { NextRequest, NextResponse } from "next/server";

/**
 * Image Proxy Route
 *
 * Why an Image Proxy?
 * ───────────────────
 * 1. ISP/Firewall Bypassing: Many ISPs and networks (especially in India and Southeast Asia)
 *    block `image.tmdb.org` at the DNS/SNI level. By proxying through the app server,
 *    images load seamlessly for all users regardless of their local ISP restrictions.
 * 2. Referrer Stripping: Prevents TMDB CDN hotlink blocking due to localhost or custom domain referrers.
 * 3. Edge & Browser Caching: Caches image responses for 7 days to minimize bandwidth and latency.
 */

const ALLOWED_HOSTS = new Set(["image.tmdb.org", "api.themoviedb.org"]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let targetUrl = rawUrl.trim();
  // Handle relative TMDB poster paths (e.g. /vUHlpA5c1NXkds59reY3HMb4Abs.jpg)
  if (targetUrl.startsWith("/")) {
    if (targetUrl.startsWith("/t/p/")) {
      targetUrl = `https://image.tmdb.org${targetUrl}`;
    } else {
      targetUrl = `https://image.tmdb.org/t/p/w500${targetUrl}`;
    }
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  // Only allow TMDB image domains for security
  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return new NextResponse("Forbidden domain", { status: 403 });
  }

  try {
    const upstreamRes = await fetch(parsed.toString(), {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    if (!upstreamRes.ok) {
      // Instead of returning 500 error, redirect browser directly to TMDB CDN
      return NextResponse.redirect(parsed.toString(), 302);
    }

    const contentType = upstreamRes.headers.get("content-type") || "image/jpeg";
    const buffer = await upstreamRes.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.warn("Image proxy fetch failed, redirecting to direct TMDB:", error?.message || error);
    return NextResponse.redirect(parsed.toString(), 302);
  }
}
