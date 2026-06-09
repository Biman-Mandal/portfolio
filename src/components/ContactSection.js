export default function ContactSection({ contact }) {
  if (!contact) return null;

  return (
    <section id="contact" className="section alt" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
  <div className="section-header reveal" style={{ textAlign: 'center' }}>
    <h2>{contact.title}</h2>
    <p className="subtitle">Ready for freelance work, collaborations, and full‑stack product builds.</p>
  </div>
  <div className="contact-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
    {/* Left side: Info & Icons */}
    <div className="info-panel" style={{ flex: '1 1 300px', maxWidth: '400px', padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', transition: 'transform 0.3s', animation: 'fadeIn 0.6s' }}>
      <p className="contact-copy" style={{ marginBottom: '1rem' }}>{contact.description}</p>
      {contact.location && <p className="meta"><strong>Location:</strong> {contact.location}</p>}
      {contact.address && <p className="meta"><strong>Address:</strong> {contact.address}</p>}
      <div className="icon-links" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {contact.email && (
          <a href={`mailto:${contact.email}`} title="Email" className="icon-link" style={{ color: '#fff', transition: 'transform 0.2s' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
              <path d="M2 4c0-1.1.9-2 2-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 .5L12 13l8-8.5V5H4v-.5zM4 19h16V7l-8 8-8-8v12z" />
            </svg>
          </a>
        )}
        {contact.phone && (
          <a href={`tel:${contact.phone}`} title="Phone" className="icon-link" style={{ color: '#fff', transition: 'transform 0.2s' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.11-.21c1.21.49 2.53.75 3.88.75a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 3.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.26 2.67.75 3.88a1.003 1.003 0 01-.21 1.11l-2.42 2.3z" />
            </svg>
          </a>
        )}
        {contact.whatsapp && (
          <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} title="WhatsApp" className="icon-link" style={{ color: '#fff', animation: 'pulse 2s infinite' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.13 1.5 5.87L0 24l6.32-1.65A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.09-3.48-8.52zM12 22c-1.94 0-3.81-.51-5.44-1.41l-.39-.23-3.76 1 1-3.68-.25-.42A9.96 9.96 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10z" />
              <path d="M17.14 14.86l-2.29-.57c-.26-.07-.53.03-.68.24l-.95 1.33c-2.35-1.21-4.09-2.95-5.31-5.31l1.33-.95c.21-.15.31-.42.24-.68l-.57-2.29c-.09-.38-.44-.63-.82-.57-2.11.36-3.66 2.35-3.66 4.5 0 2.53 2.05 4.58 4.58 4.58 2.15 0 4.13-1.55 4.5-3.66.06-.38-.19-.73-.57-.82z" />
            </svg>
          </a>
        )}
      </div>
    </div>
    {/* Right side: Contact Form */}
    <form className="contact-form" style={{ flex: '1 1 300px', maxWidth: '400px', background: 'rgba(255,255,255,0.15)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', animation: 'fadeIn 0.8s' }} onSubmit={e => { e.preventDefault(); /* Placeholder: could integrate with email service */ }}>
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '.5rem' }}>Name</label>
        <input type="text" id="name" name="name" required style={{ width: '100%', padding: '.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
      </div>
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '.5rem' }}>Email</label>
        <input type="email" id="email" name="email" required style={{ width: '100%', padding: '.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
      </div>
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="message" style={{ display: 'block', marginBottom: '.5rem' }}>Message</label>
        <textarea id="message" name="message" rows="4" required style={{ width: '100%', padding: '.5rem', borderRadius: '6px', border: '1px solid #ccc' }}></textarea>
      </div>
      <button type="submit" className="btn primary" style={{ width: '100%', padding: '.75rem', borderRadius: '6px', background: '#ff5a5f', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }} onMouseOver={e => e.currentTarget.style.background = '#e04e52'} onMouseOut={e => e.currentTarget.style.background = '#ff5a5f'}>Send Message</button>
    </form>
  </div>
  {contact.map_embed_url && (
    <iframe className="map reveal reveal-delay-2" src={contact.map_embed_url} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: '100%', height: '300px', border: '0', marginTop: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
  )}
</section>
  );
}
