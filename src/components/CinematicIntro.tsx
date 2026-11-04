/**
 * =============================================================================
 * CinematicIntro — Film-reel opening sequence for Couch Critics
 * =============================================================================
 *
 * Plays once per session (sessionStorage flag).
 * Sequence:
 *   0.0s  Black screen, film grain + sprocket holes
 *   0.3s  Film leader countdown (5 → 1) with flicker
 *   2.5s  White projector flash
 *   2.8s  Logo fades in from darkness, tagline types out
 *   4.2s  Curtains retract left/right
 *   5.0s  Entire overlay fades out, app revealed
 */

"use client";

import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "cc_intro_played";

export default function CinematicIntro({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<
    | "leader"
    | "flash"
    | "logo"
    | "curtains"
    | "fadeout"
    | "done"
  >("leader");
  const [leaderNum, setLeaderNum] = useState(5);
  const [shouldPlay, setShouldPlay] = useState(false);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  /* ─── Check session flag ─── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) {
      onComplete?.();
      return;
    }
    setShouldPlay(true);
  }, [onComplete]);

  /* ─── Skip handler ─── */
  const skipRef = useRef(false);
  const skip = () => {
    if (skipRef.current) return;
    skipRef.current = true;
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setPhase("fadeout");
    setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("done");
      onComplete?.();
    }, 1100);
  };

  /* ─── Sequence controller ─── */
  useEffect(() => {
    if (!shouldPlay) return;

    const push = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timerRef.current.push(t);
      return t;
    };

    // Leader countdown: 5 → 4 → 3 → 2 → 1  (each 350ms)
    push(() => setLeaderNum(4), 350);
    push(() => setLeaderNum(3), 700);
    push(() => setLeaderNum(2), 1050);
    push(() => setLeaderNum(1), 1400);

    // Projector flash
    push(() => setPhase("flash"), 1750);

    // Logo reveal
    push(() => setPhase("logo"), 2100);

    // Curtains retract
    push(() => setPhase("curtains"), 3600);

    // Fade the whole overlay out
    push(() => setPhase("fadeout"), 4400);

    // Fully done — unmount
    push(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("done");
      onComplete?.();
    }, 5500);

    // Any keypress skips
    const onKey = () => skip();
    window.addEventListener("keydown", onKey, { once: true });

    return () => {
      timerRef.current.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay]);

  if (!shouldPlay || phase === "done") return null;

  /* ─────────────────────────────────────────────────────────────────────────
   * Render layers (bottom-up):
   *   1. black base
   *   2. film grain (CSS animated)
   *   3. leader frame / logo / curtains
   *   4. sprocket holes overlay (decorative)
   * ───────────────────────────────────────────────────────────────────────── */

  const isLeader = phase === "leader";
  const isFlash = phase === "flash";
  const isLogo = phase === "logo";
  const isCurtains = phase === "curtains";
  const isFadeout = phase === "fadeout";

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden select-none cursor-pointer"
      style={{
        background: "#000",
        opacity: isFadeout ? 0 : 1,
        transition: isFadeout ? "opacity 1.1s cubic-bezier(0.4,0,0.2,1)" : undefined,
        pointerEvents: isFadeout ? "none" : "all",
      }}
      onClick={skip}
      aria-hidden="true"
    >
      {/* Skip hint */}
      {!isFadeout && (
        <div
          className="absolute bottom-6 right-6 font-mono text-xs tracking-widest uppercase"
          style={{
            color: "rgba(255,255,255,0.3)",
            zIndex: 100,
            animation: "cc-tagline-in 0.5s 1.5s both ease-out",
          }}
        >
          Click or press any key to skip ⏭
        </div>
      )}
      {/* ── 1. Film grain layer ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ animation: "cc-grain 0.08s steps(1) infinite", opacity: 0.08, zIndex: 1 }}
      >
        <div className="cc-grain-texture w-full h-full" />
      </div>

      {/* ── 2. Vignette ─────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.85) 100%)",
          zIndex: 2,
        }}
      />

      {/* ── 3. Sprocket holes (left & right) ────────────────────────────── */}
      {(isLeader || isFlash) && (
        <>
          <SprocketStrip side="left" />
          <SprocketStrip side="right" />
        </>
      )}

      {/* ── 4. Leader / Flash / Logo ─────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>

        {/* LEADER COUNTDOWN FRAME */}
        {isLeader && (
          <div
            key={leaderNum}
            className="relative flex items-center justify-center"
            style={{ animation: "cc-flicker 0.35s steps(1) infinite" }}
          >
            {/* Classic leader circle */}
            <div
              className="relative flex items-center justify-center rounded-full border-4 border-white/80"
              style={{
                width: 240,
                height: 240,
                background: "transparent",
                boxShadow: "0 0 60px 20px rgba(255,255,255,0.08)",
              }}
            >
              {/* Inner ring */}
              <div
                className="absolute rounded-full border border-white/30"
                style={{ width: 200, height: 200 }}
              />
              {/* Crosshair lines */}
              <div className="absolute w-full h-px bg-white/40" />
              <div className="absolute w-px h-full bg-white/40" />
              {/* Corner marks */}
              {[0, 90, 180, 270].map((deg) => (
                <div
                  key={deg}
                  className="absolute"
                  style={{
                    transform: `rotate(${deg}deg) translateY(-108px)`,
                    width: 2,
                    height: 16,
                    background: "rgba(255,255,255,0.7)",
                  }}
                />
              ))}
              {/* Countdown number */}
              <span
                className="relative font-mono font-black text-white select-none"
                style={{ fontSize: 96, lineHeight: 1, textShadow: "0 0 20px rgba(255,255,255,0.5)" }}
              >
                {leaderNum}
              </span>
            </div>

            {/* Frame edge dust scratches */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              {[15, 42, 67, 83, 95].map((pct) => (
                <div
                  key={pct}
                  className="absolute w-px bg-white/60"
                  style={{ left: `${pct}%`, top: 0, bottom: 0, height: "100%" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* WHITE PROJECTOR FLASH */}
        {isFlash && (
          <div
            className="absolute inset-0"
            style={{
              background: "white",
              animation: "cc-projector-flash 0.35s ease-out forwards",
              zIndex: 20,
            }}
          />
        )}

        {/* LOGO REVEAL */}
        {(isLogo || isCurtains || isFadeout) && (
          <div
            className="flex flex-col items-center gap-6"
            style={{
              animation: "cc-logo-rise 0.9s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
          >
            {/* Logo image */}
            <div
              style={{
                filter: "drop-shadow(0 0 40px rgba(229,9,20,0.4)) drop-shadow(0 0 80px rgba(229,9,20,0.15))",
              }}
            >
              <img
                src="/icon.png"
                alt="Couch Critics"
                width={96}
                height={96}
                className="rounded-2xl"
                style={{ imageRendering: "auto" }}
              />
            </div>

            {/* Wordmark */}
            <div className="flex flex-col items-center gap-1">
              <span
                className="font-mono font-black tracking-[0.3em] uppercase text-white"
                style={{
                  fontSize: "clamp(28px, 5vw, 44px)",
                  textShadow: "0 0 30px rgba(255,255,255,0.3)",
                  animation: "cc-text-glow 2s ease-in-out infinite alternate",
                }}
              >
                COUCH CRITICS
              </span>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 w-20" style={{ background: "linear-gradient(to right, transparent, rgba(229,9,20,0.6))" }} />
                <span
                  className="font-mono text-xs tracking-[0.4em] uppercase"
                  style={{ color: "#E50914", animation: "cc-tagline-in 0.6s 0.4s both ease-out" }}
                >
                  Your Personal Cinema Journal
                </span>
                <div className="h-px flex-1 w-20" style={{ background: "linear-gradient(to left, transparent, rgba(229,9,20,0.6))" }} />
              </div>
            </div>

            {/* Film strip decorative bar */}
            <div className="flex items-center gap-0 opacity-40 mt-2">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 20,
                    height: 14,
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRight: i < 17 ? "none" : "1px solid rgba(255,255,255,0.3)",
                    background: i % 3 === 1 ? "rgba(255,255,255,0.08)" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 5. Curtains ─────────────────────────────────────────────────── */}
      {isCurtains && (
        <>
          <CurtainPanel side="left" />
          <CurtainPanel side="right" />
        </>
      )}
      {/* Keep curtains while fading out */}
      {isFadeout && (
        <>
          <CurtainPanel side="left" retracted />
          <CurtainPanel side="right" retracted />
        </>
      )}

      {/* ── 6. Scan line overlay ────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          zIndex: 3,
        }}
      />
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function SprocketStrip({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="absolute top-0 bottom-0 flex flex-col justify-around items-center"
      style={{
        width: 44,
        [side]: 0,
        background: "#0a0a0a",
        borderRight: side === "left" ? "1px solid rgba(255,255,255,0.08)" : undefined,
        borderLeft: side === "right" ? "1px solid rgba(255,255,255,0.08)" : undefined,
        zIndex: 5,
      }}
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 22,
            height: 14,
            borderRadius: 2,
            background: "#000",
            border: "1px solid rgba(255,255,255,0.15)",
            margin: "2px 0",
          }}
        />
      ))}
    </div>
  );
}

function CurtainPanel({ side, retracted }: { side: "left" | "right"; retracted?: boolean }) {
  return (
    <div
      className="absolute top-0 bottom-0"
      style={{
        width: "55%",
        [side]: 0,
        zIndex: 50,
        background:
          side === "left"
            ? "linear-gradient(to right, #0d0d10 0%, #1a0a0b 60%, rgba(26,10,11,0.7) 100%)"
            : "linear-gradient(to left,  #0d0d10 0%, #1a0a0b 60%, rgba(26,10,11,0.7) 100%)",
        transform: retracted
          ? side === "left"
            ? "translateX(-100%)"
            : "translateX(100%)"
          : "translateX(0)",
        transition: "transform 0.85s cubic-bezier(0.76,0,0.24,1)",
        boxShadow:
          side === "left"
            ? "inset -6px 0 20px rgba(229,9,20,0.07)"
            : "inset 6px 0 20px rgba(229,9,20,0.07)",
      }}
    >
      {/* Curtain fold texture */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0"
          style={{
            width: 1,
            left: side === "left" ? `${i * 13 + 5}%` : undefined,
            right: side === "right" ? `${i * 13 + 5}%` : undefined,
            background:
              i % 2 === 0
                ? "rgba(229,9,20,0.04)"
                : "rgba(0,0,0,0.3)",
          }}
        />
      ))}
    </div>
  );
}
