export default function ContactSection({ contact }) {
  if (!contact) return null;

  return (
    <section id="contact" className="section alt">
      <div className="section-header reveal">
        <div>
          <h2>{contact.title}</h2>
          <p>Ready for freelance work, collaborations, and full stack product builds.</p>
        </div>
      </div>
      <div className="split">
        <div className="info-panel reveal reveal-delay-1">
          <p className="contact-copy">{contact.description}</p>
          {contact.location ? <p className="meta">Location: {contact.location}</p> : null}
          {contact.link ? (
            <a className="btn primary" href={contact.link} target="_blank" rel="noreferrer">
              Contact Me
            </a>
          ) : null}
        </div>
        {contact.map_embed_url ? (
          <iframe className="map reveal reveal-delay-2" src={contact.map_embed_url} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        ) : null}
      </div>
    </section>
  );
}
