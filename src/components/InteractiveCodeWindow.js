"use client";

import { useRef, useState } from "react";

export default function InteractiveCodeWindow({ children }) {
  const windowRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = windowRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const angleX = (yc - y) / 16;
    const angleY = (x - xc) / 16;

    setTilt({ x: angleX, y: angleY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={windowRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="code-window reveal reveal-delay-2"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
        transformStyle: "preserve-3d"
      }}
      aria-label="Interactive portfolio code preview"
    >
      <div style={{ transform: "translateZ(25px)" }}>
        {children}
      </div>
    </div>
  );
}
