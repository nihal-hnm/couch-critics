"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme-context";

/**
 * GradientCursorTracker
 *
 * Cinematic subtle gradient cursor tracking system:
 * - Broad, evenly dispersed 650px ambient radial gradient aura with gentle color stops.
 * - Prevents color from concentrating at one hotspot by distributing soft crimson
 *   and warm gold hues smoothly across a wide radius.
 * - Delicate, ultra-thin 16px precision cursor ring that moves in 100% lockstep unison.
 * - Hardware accelerated at z-50 with zero pointer event interference.
 */
export default function GradientCursorTracker() {
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const ring = ringRef.current;
    if (!wrapper || !ring) return;

    let isVisible = false;
    let isHovering = false;
    let isMouseDown = false;

    const setRingScale = () => {
      if (!ring) return;
      if (isMouseDown) {
        ring.style.transform = "scale(0.85)";
      } else if (isHovering) {
        ring.style.transform = "scale(1.4)";
      } else {
        ring.style.transform = "scale(1)";
      }
    };

    const updatePosition = (x: number, y: number) => {
      if (!isVisible) {
        isVisible = true;
        wrapper.style.opacity = "1";
      }

      // 1:1 Instant GPU translation - moving gradient aura and cursor ring together
      wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      document.documentElement.style.setProperty("--cursor-x", `${x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${y}px`);
    };

    const handleMove = (e: MouseEvent) => {
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
      if (wrapper) wrapper.style.opacity = "1";
      updatePosition(e.clientX, e.clientY);
    };

    // Attach listeners to document & window for maximum coverage
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("pointermove", handleMove as EventListener, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter as EventListener);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("pointermove", handleMove as EventListener);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter as EventListener);
    };
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      ref={wrapperRef}
      id="gradient-cursor-tracker"
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 opacity-0 transition-opacity duration-150"
      style={{
        willChange: "transform",
        transform: "translate3d(-2000px, -2000px, 0)",
      }}
    >
      {/* ── 1. Broad, Evenly Dispersed Ambient Radial Gradient Aura (650px subtle spread) ── */}
      <div
        className="pointer-events-none rounded-full"
        style={{
          position: "absolute",
          left: -325,
          top: -325,
          width: 650,
          height: 650,
          background: isDark
            ? "radial-gradient(circle at center, rgba(229, 9, 20, 0.08) 0%, rgba(229, 9, 20, 0.05) 25%, rgba(245, 197, 66, 0.03) 50%, rgba(245, 197, 66, 0.01) 75%, transparent 100%)"
            : "radial-gradient(circle at center, rgba(229, 9, 20, 0.045) 0%, rgba(229, 9, 20, 0.03) 25%, rgba(245, 197, 66, 0.02) 50%, rgba(245, 197, 66, 0.008) 75%, transparent 100%)",
        }}
      />

      {/* ── 2. Subtle Precision Cursor Follower (Delicate 16px Hairline Ring) ── */}
      <div
        ref={ringRef}
        className="pointer-events-none rounded-full transition-transform duration-150 ease-out"
        style={{
          position: "absolute",
          left: -8,
          top: -8,
          width: 16,
          height: 16,
          border: isDark ? "1px solid rgba(229, 9, 20, 0.4)" : "1px solid rgba(229, 9, 20, 0.3)",
          background: isDark ? "rgba(229, 9, 20, 0.06)" : "rgba(229, 9, 20, 0.04)",
          boxShadow: isDark
            ? "0 0 10px rgba(229, 9, 20, 0.25)"
            : "0 0 8px rgba(229, 9, 20, 0.15)",
        }}
      />
    </div>
  );
}
