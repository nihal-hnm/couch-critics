"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme-context";

/**
 * GradientCursorTracker
 *
 * Cinematic dual-layer cursor tracking system for Couch Critics:
 *  1. Ambient Radial Spotlight: A broad 650px gradient that sweeps across
 *     the canvas, casting soft cinematic red & warm gold illumination.
 *  2. Interactive Follower Orb: A GPU-accelerated glowing gradient ring that
 *     glides with smooth spring physics, expanding over clickable elements
 *     and reacting to clicks.
 *
 * Designed with 100% pointer-events-none and zero layout shifts.
 * Automatically disabled on mobile/touch screens via (pointer: fine) check.
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

    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isVisible = false;
    let isHoveringInteractive = false;
    let isMouseDown = false;
    let animationFrameId: number;

    const isDark = theme === "dark";

    const updateSpotlight = (x: number, y: number) => {
      if (!spotlight) return;
      if (isDark) {
        spotlight.style.background = `radial-gradient(650px circle at ${x}px ${y}px, rgba(229, 9, 20, 0.08) 0%, rgba(245, 197, 66, 0.025) 35%, transparent 70%)`;
      } else {
        spotlight.style.background = `radial-gradient(550px circle at ${x}px ${y}px, rgba(229, 9, 20, 0.045) 0%, rgba(229, 9, 20, 0.01) 40%, transparent 65%)`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        currentX = mouseX;
        currentY = mouseY;
        spotlight.style.opacity = "1";
        orb.style.opacity = "1";
      }

      // Check if hovering an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "button, a, input, select, textarea, [role='button'], .cursor-pointer, [data-interactive='true']"
        );
        isHoveringInteractive = !!interactive;
      }

      // Update CSS variables on documentElement for optional card border reflections
      document.documentElement.style.setProperty("--cursor-x", `${mouseX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${mouseY}px`);
    };

    const handleMouseDown = () => {
      isMouseDown = true;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (spotlight) spotlight.style.opacity = "0";
      if (orb) orb.style.opacity = "0";
    };

    const handleMouseEnter = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      currentX = mouseX;
      currentY = mouseY;
      isVisible = true;
      if (spotlight) spotlight.style.opacity = "1";
      if (orb) orb.style.opacity = "1";
    };

    // Physics render loop (Smooth Lerp at 60/120fps)
    const render = () => {
      if (isVisible) {
        // Lerp position for buttery trailing physics
        const lerpFactor = 0.22;
        currentX += (mouseX - currentX) * lerpFactor;
        currentY += (mouseY - currentY) * lerpFactor;

        // Update ambient spotlight (exact mouse coordinate)
        updateSpotlight(mouseX, mouseY);

        // Update follower orb position and scale
        let scale = 1;
        if (isMouseDown) {
          scale = 0.8;
        } else if (isHoveringInteractive) {
          scale = 1.6;
        }

        orb.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Attach event listeners
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <>
      {/* ── 1. Ambient Background Gradient Spotlight ── */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 opacity-0"
        style={{ willChange: "background, opacity" }}
      />

      {/* ── 2. Cinematic Interactive Follower Orb ── */}
      <div
        ref={orbRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-40 transition-opacity duration-300 opacity-0 rounded-full w-7 h-7 ${
          isDark
            ? "border border-[#E50914]/40 shadow-[0_0_16px_rgba(229,9,20,0.35)]"
            : "border border-[#E50914]/30 shadow-[0_0_12px_rgba(229,9,20,0.2)]"
        }`}
        style={{
          willChange: "transform, opacity",
          background: isDark
            ? "radial-gradient(circle, rgba(229, 9, 20, 0.4) 0%, rgba(245, 197, 66, 0.15) 50%, transparent 80%)"
            : "radial-gradient(circle, rgba(229, 9, 20, 0.25) 0%, rgba(245, 197, 66, 0.08) 50%, transparent 80%)",
          transition: "transform 0.08s ease-out, opacity 0.3s ease",
        }}
      />
    </>
  );
}
