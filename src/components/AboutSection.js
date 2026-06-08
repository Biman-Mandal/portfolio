"use client";

import { useRef, useState } from "react";

export default function AboutSection({ id, title, description }) {
  const imageRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = imageRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const angleX = (yc - y) / 10;
    const angleY = (x - xc) / 10;

    setTilt({ x: angleX, y: angleY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  if (!description) return null;

  return (
    <section id={id} className="section about-section">
      <div className="about-layout reveal">
        <div 
          ref={imageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="about-image-wrapper"
          style={{
            transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.1s ease-out",
            transformStyle: "preserve-3d"
          }}
        >
          <div className="about-image-inner" style={{ transform: "translateZ(30px)" }}>
            <img src="/developer.png" alt="Developer photo" className="about-photo" />
            <div className="about-photo-overlay" />
          </div>
        </div>

        <div className="about-content">
          <div className="about-header">
            <span className="eyebrow">A Bit About Me</span>
            <h2>{title}</h2>
          </div>
          <p className="about-copy">{description}</p>
          
          <div className="about-details">
            <div className="detail-item">
              <span className="detail-icon">⚡</span>
              <div>
                <h4>Fast Engineering</h4>
                <p>Clean Next.js architecture with zero unnecessary bloat.</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🎨</span>
              <div>
                <h4>Interactive WebGL</h4>
                <p>Creating immersive experiences with custom Three.js visuals.</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🛡️</span>
              <div>
                <h4>Safe & Production-Ready</h4>
                <p>Database safety, secure environments, and robust codebases.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
