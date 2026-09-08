import React from 'react';

export default function ProjectCard({ item, delayClass }) {
  const firstMedia = item.media?.[0] || { url: 'https://via.placeholder.com/400x250?text=Preview', type: 'image' };
  const isVideo = firstMedia?.type?.startsWith('video');

  return (
    <div className={`content-card reveal ${delayClass}`}>
      <div className="media-frame">
        {isVideo ? (
          <video src={firstMedia.url} controls muted />
        ) : (
          <img src={firstMedia.url} alt={item.title} loading="lazy" />
        )}
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
          <h3 className="card-title">{item.title}</h3>
          {item.organization && (
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              color: '#a5b4fc',
              whiteSpace: 'nowrap'
            }}>
              {item.organization}
            </span>
          )}
        </div>
        
        <p className="card-desc">{item.description}</p>
        
        {item.tech_stack?.length ? (
          <div className="card-tags" style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "12px 0 16px" }}>
            {item.tech_stack.map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: "11.5px",
                  fontWeight: 500,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid var(--line)",
                  color: "var(--muted)"
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="card-actions" style={{ marginTop: "auto", paddingTop: "8px" }}>
          {item.live_url || item.link ? (
            <a className="btn primary" href={item.live_url || item.link} target="_blank" rel="noreferrer" style={{ width: "100%", height: "40px" }}>
              Live Demo &rarr;
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
