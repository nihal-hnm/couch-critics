"use client";

import { useEffect, useRef } from "react";

/**
 * GradientCursorTracker
 *
 * Cinematic uniform gradient cursor tracking system:
 * - Ultra-smooth, uniform ambient radial gradient tracking 1:1 with cursor.
 * - Zero red circles, center hotspots, or ring followers.
 * - Seamless CSS theme-driven falloff with hardware-accelerated translate3d.
 */
export default function GradientCursorTracker() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on devices with a fine pointer (mouse / trackpad)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let isVisible = false;

    const updatePosition = (x: number, y: number) => {
      if (!isVisible) {
        isVisible = true;
        wrapper.style.opacity = "1";
      }

      // 1:1 Instant GPU translation with zero latency
      wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      document.documentElement.style.setProperty("--cursor-x", `${x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${y}px`);
    };

    const handleMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
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
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter as EventListener);
    window.addEventListener("blur", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("pointermove", handleMove as EventListener);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter as EventListener);
      window.removeEventListener("blur", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      id="gradient-cursor-tracker"
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-40 opacity-0 transition-opacity duration-200"
      style={{
        willChange: "transform",
        transform: "translate3d(-2000px, -2000px, 0)",
      }}
    >
      {/* ── Uniform Ambient Radial Gradient (Zero red circle, seamless uniform spread) ── */}
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          left: -350,
          top: -350,
          width: 700,
          height: 700,
          background: "var(--cursor-ambient-glow)",
        }}
      />
    </div>
  );
}


