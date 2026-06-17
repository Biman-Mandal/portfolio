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

  const paragraphs = [
    "With 4+ years of experience in software development, I specialize in building scalable SaaS platforms, enterprise applications, CRM systems, LMS solutions, social networking platforms, and real-time web applications. My expertise spans the entire development lifecycle—from database design and backend architecture to API development and modern frontend implementation.",
    "I have worked extensively with Laravel, PHP, Node.js, React.js, Next.js, MongoDB, and MySQL, delivering solutions that support thousands of users across industries such as Education, Logistics, Customer Engagement, Social Networking, and Business Automation.",
    "Throughout my career, I have contributed to the development of multi-tenant SaaS products, omnichannel communication platforms, real-time tracking systems, workflow automation tools, and customer-facing applications. I enjoy transforming complex business requirements into scalable, maintainable, and high-performing software solutions.",
    "I am passionate about building products that solve real-world problems, improve user experiences, and create measurable business impact."
  ];

  const highlights = [
    "Developed and maintained SaaS, CRM, LMS, and enterprise platforms",
    "Designed scalable database architectures and RESTful APIs",
    "Built real-time applications using Socket.IO and event-driven systems",
    "Integrated payment gateways including Stripe, Paypal & Razorpay",
    "Led development teams and collaborated directly with clients",
    "Delivered projects from concept to production deployment",
    "Experienced in performance optimization, system design, and backend engineering"
  ];

  const topSkills = ["Laravel", "MySQL", "MongoDB", "Node.js", "Next.js"];

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

        <div className="about-content" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="about-header" style={{ marginBottom: "0.5rem" }}>
            <span className="eyebrow">A Bit About Me</span>
            <h2>{title}</h2>
          </div>
          
          <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--accent-2)", marginBottom: "0.25rem", lineHeight: "1.4" }}>
            🚀 Full Stack Developer | SaaS, CRM & Enterprise Application Specialist
          </h3>

          <div className="about-copy-container">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="about-copy" style={{ marginBottom: "1rem", lineHeight: "1.6" }}>{p}</p>
            ))}
          </div>

          <div style={{ marginTop: "1.25rem" }}>
            <h4 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.75rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>💡</span> Key Highlights
            </h4>
            <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem", padding: 0, listStyle: "none", margin: 0 }}>
              {highlights.map((h, idx) => (
                <li key={idx} style={{ display: "flex", gap: "8px", fontSize: "0.95rem", color: "var(--muted)", lineHeight: "1.4" }}>
                  <span style={{ color: "var(--accent-2)", fontWeight: "bold" }}>•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: "1.25rem" }}>
            <h4 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.75rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🛠️</span> Top Skills
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {topSkills.map((skill, idx) => (
                <div key={idx} className="skill-card-hover" style={{
                  background: "var(--panel-strong)",
                  border: "0.5px solid var(--line)",
                  boxShadow: "var(--card-shadow)",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-2)" }} />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {(certificates.length || courses.length) ? (
        <div className="about-credentials reveal" style={{ marginTop: '56px', borderTop: '0.5px solid var(--line)', paddingTop: '40px' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px', background: 'linear-gradient(135deg, var(--ink) 50%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Certifications & Continuous Learning
          </h3>
          
          <div className="credentials-scroll">
            {/* Render Certificates */}
            {certificates.map((cert) => (
              <div key={cert.id} className="credential-card">
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', background: 'rgba(139, 92, 246, 0.06)', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '12px', border: '0.5px solid var(--line)' }}>
                  Certificate
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>{cert.title}</h4>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px' }}>{cert.issuer}</p>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5', marginBottom: '12px' }}>{cert.description}</p>
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
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', background: 'rgba(139, 92, 246, 0.06)', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '12px', border: '0.5px solid var(--line)' }}>
                  Course / Skill
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--ink)' }}>{course.title}</h4>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginBottom: '8px' }}>{course.provider}</p>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5', marginBottom: '12px' }}>{course.description}</p>
                {course.link && course.link !== '#' && (
                  <a href={course.link} target="_blank" rel="noreferrer" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
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
