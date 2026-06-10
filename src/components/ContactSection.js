"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection({ contact }) {
  if (!contact) return null;

  const email = contact.email || "bimanm193@gmail.com";
  const phone = contact.phone || "+91 62940 67811";
  const location = contact.location || "Kolkata, West Bengal, India";

  // Clean the phone number to format the WhatsApp API link correctly (e.g., "916294067811")
  const whatsappNumber = phone.replace(/[^0-9]/g, "");
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const [hoveredCard, setHoveredCard] = useState(null);

  const cardStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    padding: "1.5rem",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    textDecoration: "none",
    color: "#fff",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer"
  };

  const getCardStyle = (name) => {
    const isHovered = hoveredCard === name;
    return {
      ...cardStyle,
      transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      background: isHovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)",
      borderColor: isHovered ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.08)"
    };
  };

  return (
    <section id="contact" className="section alt" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="section-header reveal" style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2>{contact.title || "Contact"}</h2>
        <p className="subtitle">Ready for freelance work, collaborations, and full‑stack product builds.</p>
      </div>
      
      <div className="contact-container" style={{ display: "flex", flexWrap: "wrap", gap: "3rem", justifyContent: "center", alignItems: "stretch", maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Left side: Interactive Action Cards with Brand Icons */}
        <div className="info-panel" style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "1.5rem", justifyContent: "center" }}>
          
          {/* Email Card */}
          {email && (
            <a 
              href={`mailto:${email}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={getCardStyle("email")}
              onMouseEnter={() => setHoveredCard("email")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: "rgba(255, 90, 95, 0.15)",
                color: "#ff5a5f",
                flexShrink: 0
              }}>
                <Mail size={24} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email Me</span>
                <span style={{ fontSize: "17px", fontWeight: 500, wordBreak: "break-all" }}>{email}</span>
              </div>
            </a>
          )}

          {/* Phone Card */}
          {phone && (
            <a 
              href={`tel:${phone}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={getCardStyle("phone")}
              onMouseEnter={() => setHoveredCard("phone")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: "rgba(96, 165, 250, 0.15)",
                color: "#60a5fa",
                flexShrink: 0
              }}>
                <Phone size={24} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Call Me</span>
                <span style={{ fontSize: "17px", fontWeight: 500 }}>{phone}</span>
              </div>
            </a>
          )}

          {/* WhatsApp Card */}
          {whatsappNumber && (
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={getCardStyle("whatsapp")}
              onMouseEnter={() => setHoveredCard("whatsapp")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: "rgba(37, 211, 102, 0.15)",
                color: "#25D366",
                flexShrink: 0
              }}>
                {/* Brand WhatsApp Icon */}
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>WhatsApp</span>
                <span style={{ fontSize: "17px", fontWeight: 500 }}>Chat on WhatsApp</span>
              </div>
            </a>
          )}

          {/* Location Card */}
          {location && (
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
              target="_blank" 
              rel="noopener noreferrer" 
              style={getCardStyle("location")}
              onMouseEnter={() => setHoveredCard("location")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: "rgba(52, 211, 153, 0.15)",
                color: "#34d399",
                flexShrink: 0
              }}>
                <MapPin size={24} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Location</span>
                <span style={{ fontSize: "17px", fontWeight: 500 }}>{location}</span>
              </div>
            </a>
          )}

        </div>

        {/* Right side: Contact Form */}
        <form className="contact-form" style={{ flex: "1 1 400px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "2rem", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", justifyContent: "center" }} onSubmit={e => { e.preventDefault(); }}>
          <div className="form-group" style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="name" style={{ display: "block", marginBottom: ".5rem", fontSize: "14px", fontWeight: 500, color: "var(--muted)" }}>Name</label>
            <input type="text" id="name" name="name" required style={{ width: "100%", padding: ".75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }} />
          </div>
          <div className="form-group" style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: ".5rem", fontSize: "14px", fontWeight: 500, color: "var(--muted)" }}>Email</label>
            <input type="email" id="email" name="email" required style={{ width: "100%", padding: ".75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }} />
          </div>
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="message" style={{ display: "block", marginBottom: ".5rem", fontSize: "14px", fontWeight: 500, color: "var(--muted)" }}>Message</label>
            <textarea id="message" name="message" rows="4" required style={{ width: "100%", padding: ".75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none", resize: "vertical" }}></textarea>
          </div>
          <button type="submit" className="btn primary" style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "#ff5a5f", color: "#fff", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: 600, transition: "all 0.3s" }} onMouseOver={e => e.currentTarget.style.background = "#e04e52"} onMouseOut={e => e.currentTarget.style.background = "#ff5a5f"}>Send Message</button>
        </form>

      </div>
      
      {contact.map_embed_url && (
        <iframe className="map reveal reveal-delay-2" src={contact.map_embed_url} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "350px", border: "0", marginTop: "3rem", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }} />
      )}
    </section>
  );
}
