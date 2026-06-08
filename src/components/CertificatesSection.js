export default function CertificatesSection({ id, title, kicker, items = [] }) {
  if (!items.length) return null;

  return (
    <section id={id} className="section alt">
      <div className="section-header reveal">
        <div>
          <h2>{title}</h2>
          <p>{kicker}</p>
        </div>
      </div>
      <div className="certificates-list">
        {items.map((item, index) => {
          const delayClass = `reveal-delay-${(index % 3) + 1}`;
          return (
            <div className={`certificate-row reveal ${delayClass}`} key={item.id}>
              <div className="cert-badge">
                <span className="badge-icon">🎓</span>
              </div>
              <div className="cert-info">
                <h3>{item.title}</h3>
                {item.description ? <p>{item.description}</p> : null}
              </div>
              {item.link ? (
                <a className="btn primary cert-btn" href={item.link} target="_blank" rel="noreferrer">
                  Verify
                </a>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
