"use client";

import { useEffect, useState } from "react";

export default function CursorFollower() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Check if device is touch-enabled
    const hasTouch = window.matchMedia("(pointer: coarse)").matches;
    if (hasTouch) return;

    setEnabled(true);

    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest(".content-card") ||
        target.closest(".theme-toggle-btn");
      setHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  useEffect(() => {
    let frameId;
    const updateTrail = () => {
      setTrail((current) => {
        const dx = position.x - current.x;
        const dy = position.y - current.y;
        return {
          x: current.x + dx * 0.15,
          y: current.y + dy * 0.15
        };
      });
      frameId = requestAnimationFrame(updateTrail);
    };
    if (enabled) {
      frameId = requestAnimationFrame(updateTrail);
    }
    return () => cancelAnimationFrame(frameId);
  }, [position, enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Inner Core Dot */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "var(--accent)",
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
          pointerEvents: "none",
          zIndex: 9999,
          transition: "transform 0.1s ease, background-color 0.3s ease"
        }}
      />
      {/* Outer Halo Circle */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: hovered ? 46 : 26,
          height: hovered ? 46 : 26,
          borderRadius: "50%",
          border: "1px solid var(--accent)",
          backgroundColor: hovered ? "rgba(24, 213, 181, 0.06)" : "transparent",
          transform: `translate3d(${trail.x - (hovered ? 23 : 13)}px, ${trail.y - (hovered ? 23 : 13)}px, 0)`,
          pointerEvents: "none",
          zIndex: 9998,
          transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease"
        }}
      />
    </>
  );
}
