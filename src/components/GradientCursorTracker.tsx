"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme-context";

/**
 * GradientCursorTracker
 *
 * Cinematic real-time cursor tracking system for Couch Critics:
 *  1. Ambient Radial Spotlight: 600px GPU-accelerated atmospheric gradient
 *     that tracks the mouse cursor with zero lag and 1:1 matching speed.
 *  2. Interactive Cursor Orb: Sleek red/gold illuminated ring positioned
 *     directly in lockstep with the cursor, scaling dynamically over
 *     interactive buttons and clicks with smooth micro-animations.
 *
 * 100% pointer-events-none, hardware-accelerated via translate3d compositor layers,
 * zero layout shift, and disabled on touch devices.
 */
export default function GradientCursorTracker() {
  const { theme } = useTheme();

  const spotlightRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on devices with a fine pointer (mouse / trackpad)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const spotlight = spotlightRef.current;
    const orb = orbRef.current;
    if (!spotlight || !orb) return;

    let isVisible = false;
    let isHoveringInteractive = false;
    let isMouseDown = false;

    const updateScale = () => {
      if (!orb) return;
      if (isMouseDown) {
        orb.style.scale = "0.85";
      } else if (isHoveringInteractive) {
        orb.style.scale = "1.55";
      } else {
        orb.style.scale = "1";
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        spotlight.style.opacity = "1";
        orb.style.opacity = "1";
      }

      // 1:1 Instant GPU translation with zero latency - perfectly matching cursor speed
      const transform = `translate3d(${x}px, ${y}px, 0)`;
      spotlight.style.transform = transform;
      orb.style.transform = transform;

      // Check if hovering an interactive element (button, link, input, etc.)
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = !!target.closest(
          "button, a, input, select, textarea, [role='button'], .cursor-pointer, [data-interactive='true']"
        );
        if (interactive !== isHoveringInteractive) {
          isHoveringInteractive = interactive;
          updateScale();
        }
      }

      // Update CSS variables for any local card reflections
      document.documentElement.style.setProperty("--cursor-x", `${x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${y}px`);
    };

    const handlePointerDown = () => {
      isMouseDown = true;
      updateScale();
    };

    const handlePointerUp = () => {
      isMouseDown = false;
      updateScale();
    };

    const handlePointerLeave = () => {
      isVisible = false;
      if (spotlight) spotlight.style.opacity = "0";
      if (orb) orb.style.opacity = "0";
    };

    const handlePointerEnter = (e: PointerEvent) => {
      isVisible = true;
      const x = e.clientX;
      const y = e.clientY;
      const transform = `translate3d(${x}px, ${y}px, 0)`;
      if (spotlight) {
        spotlight.style.transform = transform;
        spotlight.style.opacity = "1";
      }
      if (orb) {
        orb.style.transform = transform;
        orb.style.opacity = "1";
      }
    };

    // Attach high-precision pointer event listeners
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    document.documentElement.addEventListener("pointerenter", handlePointerEnter);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      document.documentElement.removeEventListener("pointerenter", handlePointerEnter);
    };
  }, []);

  const isDark = theme === "dark";

  return (
    <>
      {/* ── 1. Ambient Background Gradient Spotlight (GPU Accelerated, 1:1 Speed) ── */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] -ml-[300px] -mt-[300px] rounded-full z-0 opacity-0 transition-opacity duration-300"
        style={{
          willChange: "transform, opacity",
          background: isDark
            ? "radial-gradient(circle at center, rgba(229, 9, 20, 0.08) 0%, rgba(245, 197, 66, 0.02) 40%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(229, 9, 20, 0.04) 0%, rgba(229, 9, 20, 0.01) 40%, transparent 68%)",
        }}
      />

      {/* ── 2. Cinematic Cursor Follower Orb (Lockstep with cursor speed) ── */}
      <div
        ref={orbRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 w-7 h-7 -ml-3.5 -mt-3.5 rounded-full z-40 opacity-0 transition-opacity duration-200 ${
          isDark
            ? "border border-[#E50914]/40 shadow-[0_0_14px_rgba(229,9,20,0.35)]"
            : "border border-[#E50914]/30 shadow-[0_0_10px_rgba(229,9,20,0.2)]"
        }`}
        style={{
          willChange: "transform, scale, opacity",
          background: isDark
            ? "radial-gradient(circle at center, rgba(229, 9, 20, 0.35) 0%, rgba(245, 197, 66, 0.12) 55%, transparent 80%)"
            : "radial-gradient(circle at center, rgba(229, 9, 20, 0.2) 0%, rgba(245, 197, 66, 0.08) 55%, transparent 80%)",
          transition: "scale 0.15s ease-out, opacity 0.2s ease",
        }}
      />
    </>
  );
}
