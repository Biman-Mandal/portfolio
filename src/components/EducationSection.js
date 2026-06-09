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
            // If the degree contains BCA, Bachelor, College, or School, mark it as Education, otherwise Experience
            const isEducation = 
              item.degree?.toLowerCase().includes('bca') || 
              item.degree?.toLowerCase().includes('bachelor') || 
              item.degree?.toLowerCase().includes('school') || 
              item.degree?.toLowerCase().includes('college') ||
              item.degree?.toLowerCase().includes('university') ||
              item.title?.toLowerCase().includes('techno india');

            const duration = item.start_year 
              ? `${item.start_year} — ${item.end_year || 'Present'}`
              : '';

            return (
              <div className={`timeline-item reveal ${delayClass}`} key={item.id}>
                <div className="timeline-dot-wrapper">
                  <div className={`timeline-dot ${isEducation ? 'edu' : 'exp'}`} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                    <span className={`timeline-tag ${isEducation ? 'edu' : 'exp'}`}>
                      {isEducation ? 'Education' : 'Experience'}
                    </span>
                    {duration && <span className="timeline-duration" style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{duration}</span>}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>{item.degree || item.title}</h3>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>{item.degree ? item.title : ''}</h4>
                  {item.description ? <p className="timeline-desc" style={{ marginBottom: 0 }}>{item.description}</p> : null}
                  {item.link ? (
                    <a className="timeline-link" href={item.link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 12 }}>
                      Details &rarr;
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
