export default function EducationSection({ id, title, kicker, items = [] }) {
  if (!items.length) return null;

  return (
    <section id={id} className="section alt">
      <div className="section-header reveal">
        <div>
          <h2>{title}</h2>
          <p>{kicker}</p>
        </div>
      </div>
      <div className="timeline-container">
        <div className="timeline-line" />
        <div className="timeline-items">
          {items.map((item, index) => {
            const delayClass = `reveal-delay-${(index % 3) + 1}`;
            return (
              <div className={`timeline-item reveal ${delayClass}`} key={item.id}>
                <div className="timeline-dot-wrapper">
                  <div className="timeline-dot" />
                </div>
                <div className="timeline-content">
                  <span className="timeline-tag">Graduated</span>
                  <h3>{item.title}</h3>
                  {item.description ? <p className="timeline-desc">{item.description}</p> : null}
                  {item.link ? (
                    <a className="timeline-link" href={item.link} target="_blank" rel="noreferrer">
                      Institution details &rarr;
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
