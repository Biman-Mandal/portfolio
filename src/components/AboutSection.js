"use client";

import { useRef, useState } from "react";

export default function AboutSection({ id, title, description, certificates = [], courses = [] }) {
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

  const aboutDescription = `I am a Senior Software Developer with 4+ years of experience. I specialize in designing and maintaining scalable backend systems, database schemas, and clean frontend integrations using PHP/Laravel, Node.js (Express), MongoDB, and MySQL.\n\n⚡ Fast Engineering\nClean Next.js architecture with zero unnecessary bloat.\n\n🎨 Interactive WebGL\nCreating immersive experiences with custom Three.js visuals.\n\n🛡️ Safe & Production-Ready\nDatabase safety, secure environments, and robust codebases.`;

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
          <p className="about-copy">{aboutDescription}</p>
          <ul className="about-details" role="list" style={{display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '2rem'}}>
            {[
              {icon: '⚡', title: 'Fast Engineering', description: 'Clean Next.js architecture with zero unnecessary bloat.'},
              {icon: '🎨', title: 'Interactive WebGL', description: 'Creating immersive experiences with custom Three.js visuals.'},
              {icon: '🛡️', title: 'Safe & Production-Ready', description: 'Database safety, secure environments, and robust codebases.'}
            ].map((item, idx) => (
              <li key={idx} className="detail-item" style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                <span className="detail-icon" aria-hidden="true" style={{fontSize: '1.5rem'}}>{item.icon}</span>
                <div>
                  <h4 style={{margin: 0, fontSize: '1.1rem', fontWeight: 700}}>{item.title}</h4>
                  <p style={{margin: '0.25rem 0 0', fontSize: '0.95rem', color: 'var(--muted)'}}>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
          
          
        </div>
      </div>

      {(certificates.length || courses.length) ? (
        <div className="about-credentials reveal" style={{ marginTop: '56px', borderTop: '1px solid var(--line)', paddingTop: '40px' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px', background: 'linear-gradient(135deg, var(--ink) 50%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Certifications & Continuous Learning
          </h3>
          
          <div className="credentials-scroll">
            {/* Render Certificates */}
            {certificates.map((cert) => (
              <div key={cert.id} className="credential-card">
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-2)', background: 'rgba(29, 78, 216, 0.06)', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '12px', border: '1px solid rgba(29, 78, 216, 0.12)' }}>
                  Certificate
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>{cert.title}</h4>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px' }}>{cert.issuer}</p>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5', marginBottom: '12px' }}>{cert.description}</p>
                {cert.link && cert.link !== '#' && (
                  <a href={cert.link} target="_blank" rel="noreferrer" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--accent-2)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Verify Credential &rarr;
                  </a>
                )}
              </div>
            ))}

            {/* Render Courses */}
            {courses.map((course) => (
              <div key={course.id} className="credential-card">
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', background: 'rgba(15, 118, 110, 0.06)', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '12px', border: '1px solid rgba(15, 118, 110, 0.12)' }}>
                  Course / Skill
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>{course.title}</h4>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginBottom: '8px' }}>{course.provider}</p>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5', marginBottom: '12px' }}>{course.description}</p>
                {course.link && course.link !== '#' && (
                  <a href={course.link} target="_blank" rel="noreferrer" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--accent-2)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Course Link &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
