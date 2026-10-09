"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme-context";

/**
 * GradientCursorTracker
 *
 * Cinematic unified gradient cursor tracking system:
 * - Single root wrapper positioned at the exact mouse coordinates in real-time.
 * - Both the atmospheric radial gradient aura and the sleek illuminated
 *   cursor ring are mounted within the SAME container layer, guaranteeing
 *   they are 100% physically locked together at all times with 0ms latency.
 * - Floats at z-50 above cards and content with pointer-events-none.
 * - Interactive hover reactions on buttons/links with smooth micro-scaling.
 */
export default function GradientCursorTracker() {
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on devices with a fine pointer (mouse / trackpad)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const wrapper = wrapperRef.current;
    const ring = ringRef.current;
    if (!wrapper || !ring) return;

    let isVisible = false;
    let isHovering = false;
    let isMouseDown = false;

    const setRingScale = () => {
      if (!ring) return;
      if (isMouseDown) {
        ring.style.transform = "translate(-50%, -50%) scale(0.85)";
      } else if (isHovering) {
        ring.style.transform = "translate(-50%, -50%) scale(1.5)";
      } else {
        ring.style.transform = "translate(-50%, -50%) scale(1)";
      }
    };

    const updatePosition = (x: number, y: number) => {
      if (!isVisible) {
        isVisible = true;
        wrapper.style.opacity = "1";
      }
      // Instant 1:1 hardware translation - moving the gradient aura and cursor ring together
      wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      document.documentElement.style.setProperty("--cursor-x", `${x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${y}px`);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = !!target.closest(
          "button, a, input, select, textarea, [role='button'], .cursor-pointer, [data-interactive='true']"
        );
        if (interactive !== isHovering) {
          isHovering = interactive;
          setRingScale();
        }
      }
    };

    const handleMouseDown = () => {
      isMouseDown = true;
      setRingScale();
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      setRingScale();
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (wrapper) wrapper.style.opacity = "0";
    };

    const handleMouseEnter = (e: MouseEvent) => {
      isVisible = true;
      updatePosition(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("pointermove", handleMouseMove as EventListener, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter as EventListener);
    window.addEventListener("blur", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointermove", handleMouseMove as EventListener);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter as EventListener);
      window.removeEventListener("blur", handleMouseLeave);
    };
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 opacity-0 transition-opacity duration-200"
      style={{
        willChange: "transform",
        transform: "translate3d(-1000px, -1000px, 0)",
      }}
    >
      {/* ── 1. Atmospheric Radial Gradient Aura (Unified with cursor) ── */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-2xl pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(229, 9, 20, 0.14) 0%, rgba(245, 197, 66, 0.04) 40%, transparent 70%)"
            : "radial-gradient(circle, rgba(229, 9, 20, 0.08) 0%, rgba(245, 197, 66, 0.03) 45%, transparent 70%)",
        }}
      />

      {/* ── 2. Crisp Illuminated Cursor Focal Ring ── */}
      <div
        ref={ringRef}
        className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full pointer-events-none transition-transform duration-150 ease-out ${
          isDark
            ? "border border-[#E50914]/60 shadow-[0_0_14px_rgba(229,9,20,0.5)]"
            : "border border-[#E50914]/50 shadow-[0_0_10px_rgba(229,9,20,0.3)]"
        }`}
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(229, 9, 20, 0.35) 0%, rgba(245, 197, 66, 0.15) 55%, transparent 80%)"
            : "radial-gradient(circle, rgba(229, 9, 20, 0.22) 0%, rgba(245, 197, 66, 0.1) 55%, transparent 80%)",
        }}
      />
    </div>
  );
}
