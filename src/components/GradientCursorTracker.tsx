"use client";

import { useEffect, useRef, useState } from "react";
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
 * - Unconditionally responsive to any mouse movement on all desktop devices.
 */
export default function GradientCursorTracker() {
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

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
        ring.style.transform = "scale(1.45)";
      } else {
        ring.style.transform = "scale(1)";
      }
    };

    const updatePosition = (x: number, y: number) => {
      if (!isVisible) {
        isVisible = true;
        wrapper.style.opacity = "1";
      }

      // 1:1 Instant GPU translation - moving the gradient aura and cursor ring together
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

  if (!isClient) return null;

  const isDark = theme === "dark";

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 opacity-0 transition-opacity duration-200"
      style={{
        willChange: "transform",
        transform: "translate3d(-2000px, -2000px, 0)",
      }}
    >
      {/* ── 1. Atmospheric Radial Gradient Aura (Centered 100% on Cursor) ── */}
      <div
        className="pointer-events-none rounded-full"
        style={{
          position: "absolute",
          left: -175,
          top: -175,
          width: 350,
          height: 350,
          filter: "blur(20px)",
          background: isDark
            ? "radial-gradient(circle at center, rgba(229, 9, 20, 0.22) 0%, rgba(245, 197, 66, 0.08) 40%, rgba(229, 9, 20, 0.03) 65%, transparent 75%)"
            : "radial-gradient(circle at center, rgba(229, 9, 20, 0.15) 0%, rgba(245, 197, 66, 0.07) 45%, rgba(229, 9, 20, 0.02) 65%, transparent 75%)",
        }}
      />

      {/* ── 2. Crisp Illuminated Cursor Focal Ring (Centered 100% on Cursor) ── */}
      <div
        ref={ringRef}
        className="pointer-events-none rounded-full transition-transform duration-150 ease-out"
        style={{
          position: "absolute",
          left: -11,
          top: -11,
          width: 22,
          height: 22,
          border: isDark ? "2px solid rgba(229, 9, 20, 0.9)" : "2px solid rgba(229, 9, 20, 0.8)",
          boxShadow: isDark
            ? "0 0 16px rgba(229, 9, 20, 0.65), 0 0 6px rgba(245, 197, 66, 0.4)"
            : "0 0 12px rgba(229, 9, 20, 0.45), 0 0 4px rgba(245, 197, 66, 0.3)",
          background: isDark
            ? "radial-gradient(circle, rgba(229, 9, 20, 0.5) 0%, rgba(245, 197, 66, 0.2) 60%, transparent 85%)"
            : "radial-gradient(circle, rgba(229, 9, 20, 0.3) 0%, rgba(245, 197, 66, 0.15) 60%, transparent 85%)",
        }}
      />
    </div>
  );
}
