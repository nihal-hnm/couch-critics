/**
 * =============================================================================
 * ShareModal — Comprehensive Sharing & Export Hub for Couch Critics
 * =============================================================================
 * Allows sharing:
 *   1. Public Web Link (/share#d=...)
 *   2. Cinema Visual Share Card (PNG Image export / copy)
 *   3. Formatted Markdown & Plain Text (Discord, Reddit, WhatsApp)
 *   4. JSON & CSV Data Export (Backup & Letterboxd import)
 *
 * Full Daylight Light Mode + Dark Cinema support with high-contrast accessibility.
 */

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  Film,
  Tv,
  Star,
  Play,
  Clock,
  Send,
  Smartphone,
  Eye,
  CheckCircle2,
} from "lucide-react";
import type { MovieEntry } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import {
  type ShareScope,
  encodeSharePayload,
  generateMarkdownShare,
  generatePlainTextShare,
  generateCsvShare,
  generateJsonShare,
  downloadFile,
  copyTextToClipboard,
  filterEntriesByScope,
} from "@/lib/share-utils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: MovieEntry[];
  initialScope?: ShareScope;
}

type ShareFormat = "link" | "card" | "text" | "export";

export default function ShareModal({
  isOpen,
  onClose,
  entries,
  initialScope = "all",
}: ShareModalProps) {
  const { user } = useAuth();
  const [scope, setScope] = useState<ShareScope>(initialScope);
  const [activeFormat, setActiveFormat] = useState<ShareFormat>("link");
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [textFormat, setTextFormat] = useState<"markdown" | "plain">("markdown");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);

  // User display name
  const userName = useMemo(() => {
    if (user?.user_metadata?.["full_name"]) return user.user_metadata["full_name"];
    if (user?.email) return user.email.split("@")[0];
    return "My";
  }, [user]);

  // Counts
  const watching = useMemo(() => entries.filter((e) => e.shelf === "watching"), [entries]);
  const toWatch = useMemo(() => entries.filter((e) => e.shelf === "toWatch"), [entries]);
  const watched = useMemo(() => entries.filter((e) => e.shelf === "watched"), [entries]);
  const filteredEntries = useMemo(() => filterEntriesByScope(entries, scope), [entries, scope]);

  // Average rating
  const avgRating = useMemo(() => {
    const rated = watched.filter((e) => e.review?.rating);
    if (rated.length === 0) return 0;
    const sum = rated.reduce((acc, curr) => acc + (curr.review?.rating || 0), 0);
    return Math.round((sum / rated.length) * 10) / 10;
  }, [watched]);

  // Reset initial scope when modal opens
  useEffect(() => {
    if (isOpen) {
      setScope(initialScope);
      setCopiedType(null);
    }
  }, [isOpen, initialScope]);

  // Generate shareable URL whenever scope or entries change
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    async function buildUrl() {
      setIsGeneratingLink(true);
      try {
        const encoded = await encodeSharePayload(entries, scope, userName);
        if (!isCancelled) {
          const origin = typeof window !== "undefined" ? window.location.origin : "";
          setShareUrl(`${origin}/share#d=${encoded}`);
        }
      } catch (err) {
        console.error("Failed to generate share URL:", err);
      } finally {
        if (!isCancelled) setIsGeneratingLink(false);
      }
    }

    buildUrl();
    return () => {
      isCancelled = true;
    };
  }, [isOpen, entries, scope, userName]);

  // Helper for copy notifications
  const handleCopy = async (text: string, type: string) => {
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  // ─── Render Canvas Cinema Card ─────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || activeFormat !== "card") return;

    let isMounted = true;
    setIsGeneratingCard(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1200;
    const height = 675; // 16:9 cinema ratio
    canvas.width = width;
    canvas.height = height;

    // 1. Background gradient (Cinema Dark Obsidian)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#121420");
    bgGrad.addColorStop(0.5, "#0A0B10");
    bgGrad.addColorStop(1, "#050508");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ambient radial lighting blooms
    const bloomCrimson = ctx.createRadialGradient(250, 150, 10, 250, 150, 400);
    bloomCrimson.addColorStop(0, "rgba(229, 9, 20, 0.22)");
    bloomCrimson.addColorStop(1, "rgba(229, 9, 20, 0)");
    ctx.fillStyle = bloomCrimson;
    ctx.fillRect(0, 0, width, height);

    const bloomGold = ctx.createRadialGradient(950, 500, 10, 950, 500, 450);
    bloomGold.addColorStop(0, "rgba(249, 184, 56, 0.16)");
    bloomGold.addColorStop(1, "rgba(249, 184, 56, 0)");
    ctx.fillStyle = bloomGold;
    ctx.fillRect(0, 0, width, height);

    // 3. Luxury Outer Border with Rounded Corners
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    // Inner gold hairline accent
    ctx.strokeStyle = "rgba(249, 184, 56, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // 4. Header: Logo & Branding
    // Brand icon circle
    ctx.fillStyle = "#162840";
    ctx.beginPath();
    ctx.arc(88, 88, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(249, 184, 56, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Brand icon gold sofa glyph representation
    ctx.fillStyle = "#F9B838";
    ctx.fillRect(72, 85, 32, 12);
    ctx.fillRect(68, 80, 8, 16);
    ctx.fillRect(100, 80, 8, 16);

    // Brand text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px monospace, sans-serif";
    ctx.fillText("COUCH CRITICS", 132, 82);

    ctx.fillStyle = "rgba(161, 161, 170, 0.9)";
    ctx.font = "12px monospace, sans-serif";
    ctx.fillText("PERSONAL CINEMA & TV JOURNAL", 132, 104);

    // User badge on right
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(width - 340, 64, 260, 48);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.strokeRect(width - 340, 64, 260, 48);

    ctx.fillStyle = "#F9B838";
    ctx.beginPath();
    ctx.arc(width - 315, 88, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#F5F5F5";
    ctx.font = "600 16px sans-serif";
    const userLabel = `${userName}'s Journal`;
    ctx.fillText(userLabel.slice(0, 20), width - 296, 94);

    // 5. Four Key Metric Stat Cards
    const statCards = [
      { label: "WATCHED ARCHIVE", value: `${watched.length}`, color: "#10B981", sub: "Finished Titles" },
      { label: "CURRENTLY WATCHING", value: `${watching.length}`, color: "#E50914", sub: "In Progress" },
      { label: "TO WATCH BACKLOG", value: `${toWatch.length}`, color: "#F59E0B", sub: "Curated Queue" },
      { label: "CRITIC AVERAGE", value: avgRating > 0 ? `${avgRating} ★` : "—", color: "#F9B838", sub: "Overall Rating" },
    ];

    const cardY = 160;
    const cardW = 250;
    const cardH = 110;
    const startX = 70;
    const gap = 20;

    statCards.forEach((stat, idx) => {
      const cx = startX + idx * (cardW + gap);

      ctx.fillStyle = "rgba(21, 21, 28, 0.85)";
      ctx.fillRect(cx, cardY, cardW, cardH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx, cardY, cardW, cardH);

      ctx.fillStyle = stat.color;
      ctx.fillRect(cx, cardY, cardW, 4);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 34px monospace, sans-serif";
      ctx.fillText(stat.value, cx + 20, cardY + 52);

      ctx.fillStyle = "rgba(228, 228, 231, 0.9)";
      ctx.font = "bold 11px monospace, sans-serif";
      ctx.fillText(stat.label, cx + 20, cardY + 76);

      ctx.fillStyle = "rgba(161, 161, 170, 0.7)";
      ctx.font = "11px sans-serif";
      ctx.fillText(stat.sub, cx + 20, cardY + 95);
    });

    // 6. Featured Titles Showcase Section
    ctx.fillStyle = "rgba(249, 184, 56, 0.9)";
    ctx.font = "bold 13px monospace, sans-serif";
    ctx.fillText("HIGHLIGHTED TITLES & RECENT REVIEWS", 70, 320);

    const showcase = [
      ...watching.slice(0, 2),
      ...watched.filter((e) => e.review?.rating && e.review.rating >= 8).slice(0, 3),
      ...toWatch.slice(0, 1),
    ].slice(0, 5);

    const showcaseY = 345;
    const itemW = 200;
    const itemH = 200;
    const itemGap = 15;

    showcase.forEach((item, idx) => {
      const ix = 70 + idx * (itemW + itemGap);

      ctx.fillStyle = "rgba(18, 18, 26, 0.95)";
      ctx.fillRect(ix, showcaseY, itemW, itemH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
      ctx.lineWidth = 1;
      ctx.strokeRect(ix, showcaseY, itemW, itemH);

      const isW = item.shelf === "watched";
      const isC = item.shelf === "watching";
      ctx.fillStyle = isW ? "#10B981" : isC ? "#E50914" : "#F59E0B";
      ctx.fillRect(ix, showcaseY, itemW, 3);

      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(ix + 12, showcaseY + 14, 56, 20);
      ctx.fillStyle = "#A1A1AA";
      ctx.font = "bold 9px monospace, sans-serif";
      ctx.fillText(item.tmdb.mediaType === "tv" ? "TV SHOW" : "MOVIE", ix + 18, showcaseY + 28);

      ctx.fillStyle = "#71717A";
      ctx.font = "11px monospace, sans-serif";
      ctx.fillText(item.tmdb.releaseYear || "", ix + itemW - 48, showcaseY + 28);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 15px sans-serif";
      const title = item.tmdb.title.length > 20 ? item.tmdb.title.slice(0, 18) + "..." : item.tmdb.title;
      ctx.fillText(title, ix + 12, showcaseY + 70);

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "11px sans-serif";
      const dir = item.tmdb.director ? `Dir: ${item.tmdb.director}` : (item.tmdb.genres?.[0] || "");
      ctx.fillText(dir.slice(0, 22), ix + 12, showcaseY + 92);

      if (item.shelf === "watched" && item.review?.rating) {
        ctx.fillStyle = "rgba(249, 184, 56, 0.15)";
        ctx.fillRect(ix + 12, showcaseY + 115, 80, 28);
        ctx.strokeStyle = "rgba(249, 184, 56, 0.4)";
        ctx.strokeRect(ix + 12, showcaseY + 115, 80, 28);

        ctx.fillStyle = "#F9B838";
        ctx.font = "bold 13px monospace, sans-serif";
        ctx.fillText(`★ ${item.review.rating}/10`, ix + 22, showcaseY + 134);
      } else if (item.shelf === "watching" && item.progress) {
        ctx.fillStyle = "rgba(229, 9, 20, 0.15)";
        ctx.fillRect(ix + 12, showcaseY + 115, 110, 28);
        ctx.strokeStyle = "rgba(229, 9, 20, 0.4)";
        ctx.strokeRect(ix + 12, showcaseY + 115, 110, 28);

        ctx.fillStyle = "#FF5555";
        ctx.font = "bold 12px monospace, sans-serif";
        const progressStr = `S${item.progress.currentSeason || 1}:E${item.progress.currentEpisode || 1}`;
        ctx.fillText(progressStr, ix + 18, showcaseY + 134);
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(ix + 12, showcaseY + 115, 90, 28);
        ctx.fillStyle = "#A1A1AA";
        ctx.font = "11px monospace, sans-serif";
        ctx.fillText("On Watchlist", ix + 22, showcaseY + 133);
      }

      if (item.review?.notes) {
        ctx.fillStyle = "rgba(212, 212, 216, 0.8)";
        ctx.font = "italic 11px sans-serif";
        const note = `"${item.review.notes.slice(0, 28)}..."`;
        ctx.fillText(note, ix + 12, showcaseY + 172);
      }
    });

    // 7. Footer
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    ctx.fillRect(32, height - 70, width - 64, 38);

    ctx.fillStyle = "#A1A1AA";
    ctx.font = "12px monospace, sans-serif";
    ctx.fillText("couch-critics-phi.vercel.app", 60, height - 46);

    ctx.fillStyle = "rgba(161, 161, 170, 0.6)";
    ctx.fillText("• TRACK EPISODES • CURATE BACKLOG • ANALYZE METRICS", 310, height - 46);

    ctx.fillStyle = "#F9B838";
    ctx.fillText("COUCH CRITICS 2026", width - 220, height - 46);

    if (isMounted) {
      setCardDataUrl(canvas.toDataURL("image/png"));
      setIsGeneratingCard(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeFormat, watched, watching, toWatch, avgRating, userName]);

  // Download Card image
  const handleDownloadCard = () => {
    if (!cardDataUrl) return;
    const a = document.createElement("a");
    a.href = cardDataUrl;
    a.download = `couch-critics-${userName.toLowerCase().replace(/\s+/g, "-")}-card.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy card image to clipboard
  const handleCopyCardImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (navigator.clipboard as any).write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopiedType("card-image");
          setTimeout(() => setCopiedType(null), 2500);
        } catch (err) {
          console.error("Clipboard image write failed:", err);
          handleDownloadCard();
        }
      });
    } catch {
      handleDownloadCard();
    }
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${userName}'s Cinema Journal on Couch Critics`,
          text: `Check out my watched movies, series, and backlog on Couch Critics! (${watched.length} watched, ${watching.length} watching, ${toWatch.length} to watch)`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy(shareUrl, "link");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="share-modal-card relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#15151C] border border-[#292932] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        {/* ══ Header ══ */}
        <div className="p-4 sm:p-5 border-b border-[#292932] flex items-center justify-between bg-[#0B0B0F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[#F9B838] shadow-sm shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-base sm:text-lg font-bold tracking-tight">
                Share Your Journal
              </h2>
              <p className="text-xs text-zinc-400">
                Share your watched archive, current series & backlog with friends
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="close-btn p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ══ Scope Selector Tabs ══ */}
        <div className="px-4 sm:px-6 pt-3.5 pb-3 bg-[#0B0B0F] border-b border-[#292932]">
          <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-2 font-semibold">
            Select Data to Share
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setScope("all")}
              className={`px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between border cursor-pointer ${
                scope === "all"
                  ? "scope-btn-active-all"
                  : "scope-btn-inactive"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>All Data</span>
              </div>
              <span className="font-mono text-[10px] opacity-75">{entries.length}</span>
            </button>

            <button
              onClick={() => setScope("watching")}
              className={`px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between border cursor-pointer ${
                scope === "watching"
                  ? "scope-btn-active-watching"
                  : "scope-btn-inactive"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-current text-red-500" />
                <span>Watching</span>
              </div>
              <span className="font-mono text-[10px] opacity-75">{watching.length}</span>
            </button>

            <button
              onClick={() => setScope("toWatch")}
              className={`px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between border cursor-pointer ${
                scope === "toWatch"
                  ? "scope-btn-active-toWatch"
                  : "scope-btn-inactive"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>To Watch</span>
              </div>
              <span className="font-mono text-[10px] opacity-75">{toWatch.length}</span>
            </button>

            <button
              onClick={() => setScope("watched")}
              className={`px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between border cursor-pointer ${
                scope === "watched"
                  ? "scope-btn-active-watched"
                  : "scope-btn-inactive"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Watched</span>
              </div>
              <span className="font-mono text-[10px] opacity-75">{watched.length}</span>
            </button>
          </div>
        </div>

        {/* ══ Format Selector Pills ══ */}
        <div className="px-4 sm:px-6 py-2.5 flex items-center gap-2 border-b border-[#292932] overflow-x-auto scrollbar-none bg-[#15151C]">
          <button
            onClick={() => setActiveFormat("link")}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeFormat === "link"
                ? "format-pill-active"
                : "format-pill-inactive"
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            <span>Web Link</span>
          </button>

          <button
            onClick={() => setActiveFormat("card")}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeFormat === "card"
                ? "format-pill-active"
                : "format-pill-inactive"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-red-500" />
            <span>Cinema Card</span>
          </button>

          <button
            onClick={() => setActiveFormat("text")}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeFormat === "text"
                ? "format-pill-active"
                : "format-pill-inactive"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Markdown / Text</span>
          </button>

          <button
            onClick={() => setActiveFormat("export")}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeFormat === "export"
                ? "format-pill-active"
                : "format-pill-inactive"
            }`}
          >
            <Download className="w-3.5 h-3.5 text-cyan-500" />
            <span>Export Data</span>
          </button>
        </div>

        {/* ══ Body / Active Panel Content ══ */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-[#15151C]">
          {/* ── PANEL 1: Public Web Link ── */}
          {activeFormat === "link" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#292932] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">
                    Live Public Journal Link
                  </span>
                  <span className="text-[11px] font-mono text-amber-500 dark:text-amber-400 font-semibold">
                    {filteredEntries.length} titles included
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={isGeneratingLink ? "Generating share link..." : shareUrl}
                    className="flex-1 bg-[#15151C] border border-[#292932] rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none select-all"
                  />
                  <button
                    onClick={() => handleCopy(shareUrl, "link")}
                    disabled={isGeneratingLink || !shareUrl}
                    className="px-3.5 py-2.5 bg-[#E50914] hover:bg-[#FF3B3B] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md disabled:opacity-50 keep-white"
                  >
                    {copiedType === "link" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Anyone with this link can view your watched archive with ratings, your in-progress series, and your backlog. No login or installation required.
                </p>
              </div>

              {/* Social & Native Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `🍿 Check out ${userName}'s Cinema Journal on Couch Critics!\n${shareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-share-btn p-3 rounded-xl bg-[#0B0B0F] hover:bg-white/5 border border-[#292932] transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer group"
                >
                  <Send className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span>Share on WhatsApp</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `🍿 My cinema & TV journal on @CouchCritics: ${watched.length} watched, ${watching.length} watching, ${toWatch.length} to watch!\n${shareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-share-btn p-3 rounded-xl bg-[#0B0B0F] hover:bg-white/5 border border-[#292932] transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
                  <span>Post to X / Twitter</span>
                </a>

                <button
                  onClick={handleNativeShare}
                  className="social-share-btn p-3 rounded-xl bg-[#0B0B0F] hover:bg-white/5 border border-[#292932] transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer group"
                >
                  <Smartphone className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span>Native App Share</span>
                </button>
              </div>

              {/* Quick Preview Button */}
              {shareUrl && (
                <div className="pt-2 text-center">
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 font-medium hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open public view in new tab to test</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ── PANEL 2: Cinema Card (PNG Graphic) ── */}
          {activeFormat === "card" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold">
                    Cinema Story Card (16:9 1200×675)
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    A high-resolution visual showcase card ready for Instagram, Twitter, and Discord
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCardImage}
                    className="social-share-btn px-3 py-1.5 rounded-xl bg-[#0B0B0F] border border-[#292932] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {copiedType === "card-image" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Image</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadCard}
                    className="px-3 py-1.5 rounded-xl bg-[#E50914] hover:bg-[#FF3B3B] text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md keep-white"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>

              {/* Canvas Preview Container */}
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-[#292932] bg-[#07070A] shadow-2xl flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-full object-contain" />
                {isGeneratingCard && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-zinc-300 font-mono">
                    Generating cinema card...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PANEL 3: Markdown & Plain Text ── */}
          {activeFormat === "text" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 p-1 bg-[#0B0B0F] border border-[#292932] rounded-lg">
                  <button
                    onClick={() => setTextFormat("markdown")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      textFormat === "markdown"
                        ? "format-pill-active"
                        : "format-pill-inactive"
                    }`}
                  >
                    Markdown (Discord/Reddit)
                  </button>
                  <button
                    onClick={() => setTextFormat("plain")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      textFormat === "plain"
                        ? "format-pill-active"
                        : "format-pill-inactive"
                    }`}
                  >
                    Plain Text (SMS/WhatsApp)
                  </button>
                </div>

                <button
                  onClick={() => {
                    const text =
                      textFormat === "markdown"
                        ? generateMarkdownShare(entries, scope, userName)
                        : generatePlainTextShare(entries, scope, userName);
                    handleCopy(text, "text");
                  }}
                  className="px-3 py-1.5 bg-[#E50914] hover:bg-[#FF3B3B] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md keep-white"
                >
                  {copiedType === "text" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Formatted Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Text Area Preview */}
              <div className="relative">
                <textarea
                  readOnly
                  rows={12}
                  value={
                    textFormat === "markdown"
                      ? generateMarkdownShare(entries, scope, userName)
                      : generatePlainTextShare(entries, scope, userName)
                  }
                  className="w-full bg-[#0B0B0F] border border-[#292932] rounded-xl p-3.5 text-xs font-mono focus:outline-none resize-none leading-relaxed select-all"
                />
              </div>
            </div>
          )}

          {/* ── PANEL 4: Export Data (JSON & CSV) ── */}
          {activeFormat === "export" && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                Export your personal journal for backup, migration, or importing into other tools like Letterboxd and spreadsheets.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* JSON Card */}
                <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#292932] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500 mb-2.5">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold">Full JSON Backup</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Complete export of all {filteredEntries.length} entries, reviews, episode logs, and timestamps.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const json = generateJsonShare(filteredEntries, userName);
                      downloadFile(json, `couch-critics-backup-${Date.now()}.json`, "application/json");
                    }}
                    className="social-share-btn w-full py-2.5 rounded-xl bg-[#15151C] hover:bg-white/10 border border-[#292932] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Download JSON ({filteredEntries.length} items)</span>
                  </button>
                </div>

                {/* CSV Card */}
                <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#292932] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-2.5">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold">Letterboxd / Excel CSV</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Tabular format containing Title, Year, Rating, Shelf, Notes, and TMDB IDs.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const csv = generateCsvShare(filteredEntries);
                      downloadFile(csv, `couch-critics-export-${Date.now()}.csv`, "text/csv");
                    }}
                    className="social-share-btn w-full py-2.5 rounded-xl bg-[#15151C] hover:bg-white/10 border border-[#292932] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Download CSV ({filteredEntries.length} items)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══ Footer ══ */}
        <div className="p-4 border-t border-[#292932] bg-[#0B0B0F] flex items-center justify-between text-xs text-zinc-400">
          <span>Curated on Couch Critics</span>
          <button
            onClick={onClose}
            className="close-btn px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
