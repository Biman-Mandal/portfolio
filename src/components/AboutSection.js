"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Award, BookOpen } from "lucide-react";

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

    const angleX = (yc - y) / 14;
    const angleY = (x - xc) / 14;

    setTilt({ x: angleX, y: angleY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const paragraphs = [
    "With 4+ years of hands-on software development experience, I specialize in architecting scalable SaaS platforms, multi-tenant CRM systems, LMS applications, and high-throughput real-time APIs. My core expertise covers full-stack web engineering—from database modeling and backend microservices to responsive frontend interfaces.",
    "I work extensively with Node.js (Express), Laravel, React, Next.js, MySQL, and MongoDB, engineering systems that handle thousands of active users across logistics, education, social tech, and workflow automation.",
    "Passionate about clean code architecture, performance optimization, and transformation of complex enterprise requirements into seamless product experiences."
  ];

  const highlights = [
    "SaaS & Multi-tenant Architecture Specialist",
    "Scalable Database Design & RESTful APIs",
    "Real-time Systems with Socket.IO & Event Queues",
    "Payment Systems (Stripe, PayPal, Razorpay)",
    "Lead Backend Engineering & Agile Collaboration",
    "Production Performance Optimization & Security"
  ];

  const topSkills = ["Node.js", "Laravel", "PHP", "Express.js", "Next.js", "React", "MongoDB", "MySQL", "Docker", "Socket.IO"];

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
          <div className="about-image-inner">
            <img src="/developer.png" alt="Developer photo" className="about-photo" />
            <div className="about-photo-overlay" />
          </div>
        </div>

        <div className="about-content">
          <div className="about-header">
            <span className="eyebrow">A Bit About Me</span>
            <h2>{title}</h2>
          </div>
          
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#818cf8", margin: 0, lineHeight: "1.4" }}>
            Full Stack Developer | SaaS, CRM & Enterprise Application Specialist
          </h3>

          <div className="about-copy-container">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="about-copy" style={{ marginBottom: "1rem" }}>{p}</p>
            ))}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1rem", color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
              Key Technical Highlights
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
              {highlights.map((h, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(19, 27, 46, 0.5)",
                  border: "1px solid var(--line)",
                  fontSize: "13.5px",
                  color: "var(--muted)"
                }}>
                  <CheckCircle2 size={16} style={{ color: "#6366f1", flexShrink: 0 }} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "1.25rem" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--ink)" }}>
              Core Technical Stack
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {topSkills.map((skill, idx) => (
                <div key={idx} style={{
                  background: "rgba(99, 102, 241, 0.08)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "12.5px",
                  color: "#a5b4fc",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#6366f1" }} />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {(certificates.length || courses.length) ? (
        <div className="about-credentials reveal" style={{ marginTop: '72px', borderTop: '1px solid var(--line)', paddingTop: '48px', maxWidth: '1140px', margin: '72px auto 0' }}>
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
              Certifications & Professional Learning
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginTop: '4px' }}>
              Continuous skill acquisition and verified technical credentials.
            </p>
          </div>
          
          <div className="credentials-scroll">
            {/* Render Certificates */}
            {certificates.map((cert) => (
              <div key={cert.id} className="credential-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Award size={16} style={{ color: '#818cf8' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.05em' }}>
                    Verified Certificate
                  </span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>{cert.title}</h4>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginBottom: '8px' }}>{cert.issuer}</p>
                <p style={{ fontSize: '13px', color: 'var(--muted-dim)', lineHeight: '1.5', marginBottom: '14px' }}>{cert.description}</p>
                {cert.link && cert.link !== '#' && (
                  <a href={cert.link} target="_blank" rel="noreferrer" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Verify Credential &rarr;
                  </a>
                )}
              </div>
            ))}

            {/* Render Courses */}
            {courses.map((course) => (
              <div key={course.id} className="credential-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <BookOpen size={16} style={{ color: '#34d399' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#34d399', letterSpacing: '0.05em' }}>
                    Skill Course
                  </span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>{course.title}</h4>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginBottom: '8px' }}>{course.provider}</p>
                <p style={{ fontSize: '13px', color: 'var(--muted-dim)', lineHeight: '1.5', marginBottom: '14px' }}>{course.description}</p>
                {course.link && course.link !== '#' && (
                  <a href={course.link} target="_blank" rel="noreferrer" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Course Overview &rarr;
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
