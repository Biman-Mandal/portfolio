"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Download } from "lucide-react";

export default function ContactSection({ contact }) {
  if (!contact) return null;

  const email = contact.email || "bimanm193@gmail.com";
  const phone = contact.phone || "+91 62940 67811";
  const location = contact.location || "Kolkata, West Bengal, India";

  // Clean the phone number to format the WhatsApp API link correctly (e.g., "916294067811")
  const whatsappNumber = phone.replace(/[^0-9]/g, "");
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const [hoveredCard, setHoveredCard] = useState(null);
  const [formStatus, setFormStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("sending");

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message")
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setFormStatus("success");
        e.target.reset();
      } else {
        setFormStatus("error");
      }
    } catch (err) {
      console.error("Contact API Error:", err);
      setFormStatus("error");
    }
  };

  const cardStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    padding: "1.25rem 1.5rem",
    borderRadius: "16px",
    background: "var(--panel-strong)",
    border: "0.5px solid var(--line)",
    boxShadow: "var(--card-shadow)",
    textDecoration: "none",
    color: "var(--ink)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer"
  };

  const getCardStyle = (name) => {
    const isHovered = hoveredCard === name;
    return {
      ...cardStyle,
      transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      background: isHovered ? "var(--panel)" : "var(--panel-strong)",
      borderColor: isHovered ? "var(--accent)" : "var(--line)",
      boxShadow: isHovered ? "0 12px 24px rgba(0, 0, 0, 0.08)" : "var(--card-shadow)"
    };
  };

  return (
    <section id="contact" className="section alt" style={{ borderTop: "1px solid var(--line)" }}>
      <div className="section-header reveal" style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ margin: "0 auto" }}>
          <h2 style={{ textAlign: "center" }}>{contact.title || "Get In Touch"}</h2>
          <p className="subtitle" style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
            Open for Lead Backend roles, Senior Full-Stack opportunities & consultancy.
          </p>
        </div>
      </div>
      
      <div className="contact-container reveal">
        {/* Left side: Interactive Action Cards */}
        <div className="contact-card-grid">
          {/* Email Card */}
          {email && (
            <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer" className="contact-card">
              <div className="contact-card-icon">
                <Mail size={20} />
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Email</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", wordBreak: "break-all" }}>{email}</span>
              </div>
            </a>
          )}

          {/* Phone Card */}
          {phone && (
            <a href={`tel:${phone}`} target="_blank" rel="noopener noreferrer" className="contact-card">
              <div className="contact-card-icon">
                <Phone size={20} />
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Phone</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{phone}</span>
              </div>
            </a>
          )}

          {/* WhatsApp Card */}
          {whatsappNumber && (
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-card">
              <div className="contact-card-icon" style={{ background: "rgba(37, 211, 102, 0.12)", color: "#25D366" }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>WhatsApp</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>Direct Message</span>
              </div>
            </a>
          )}

          {/* Location Card */}
          {location && (
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" className="contact-card">
              <div className="contact-card-icon" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                <MapPin size={20} />
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Location</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{location}</span>
              </div>
            </a>
          )}

          {/* LinkedIn Card */}
          <a href={contact.linkedin_url || "https://www.linkedin.com/in/im-bimanmandal/"} target="_blank" rel="noopener noreferrer" className="contact-card">
            <div className="contact-card-icon" style={{ background: "rgba(10, 102, 194, 0.12)", color: "#0A66C2" }}>
              <Linkedin size={20} />
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>LinkedIn</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>Profile</span>
            </div>
          </a>

          {/* Resume Card */}
          <a href={contact.resume_url && contact.resume_url !== "#" ? contact.resume_url : "/resume.pdf"} download target="_blank" rel="noopener noreferrer" className="contact-card">
            <div className="contact-card-icon">
              <Download size={20} />
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Resume</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>Download CV</span>
            </div>
          </a>
        </div>

        {/* Right side: Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--ink)" }}>
            Send a Direct Message
          </h3>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" name="name" required placeholder="John Doe" />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" required placeholder="john@example.com" />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label htmlFor="phone">Phone (Optional)</label>
            <input type="tel" id="phone" name="phone" placeholder="+1 (555) 000-0000" />
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" required placeholder="How can I help with your next project?"></textarea>
          </div>

          <button type="submit" className="btn primary" style={{ width: "100%" }} disabled={formStatus === "sending"}>
            {formStatus === "sending" ? "Sending..." : "Send Message &rarr;"}
          </button>

          {formStatus === "sending" && (
            <p style={{ marginTop: "12px", fontSize: "13.5px", color: "var(--accent-2)", fontWeight: 500, textAlign: "center" }}>
              Sending your message...
            </p>
          )}
          {formStatus === "success" && (
            <p style={{ marginTop: "12px", fontSize: "13.5px", color: "#34d399", fontWeight: 500, textAlign: "center" }}>
              Message sent successfully! I will reply shortly.
            </p>
          )}
          {formStatus === "error" && (
            <p style={{ marginTop: "12px", fontSize: "13.5px", color: "var(--danger)", fontWeight: 500, textAlign: "center" }}>
              Failed to send message. Please try again or email directly.
            </p>
          )}
        </form>
      </div>

      {contact.map_embed_url && (
        <div style={{ maxWidth: "1080px", margin: "40px auto 0" }} className="reveal">
          <iframe className="map" src={contact.map_embed_url} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "300px", border: "1px solid var(--line)", borderRadius: "16px" }} />
        </div>
      )}
    </section>
  );
}
