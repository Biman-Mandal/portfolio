import React from 'react';
import Image from 'next/image'; // Assuming using next, but fallback to <img>

export default function ProjectCard({ item, delayClass }) {
  const firstMedia = item.media?.[0] || { url: 'https://via.placeholder.com/400x250?text=Preview', type: 'image' };
  const isVideo = firstMedia?.type?.startsWith('video');

  return (
    <div
      className={`content-card reveal ${delayClass}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="media-frame">
        {isVideo ? (
          <video src={firstMedia.url} controls muted />
        ) : (
          <img src={firstMedia.url} alt={item.title} loading="lazy" />
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-desc">{item.description}</p>
        {item.tech_stack?.length ? (
          <div className="card-tags" style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0 14px" }}>
            {item.tech_stack.map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: "var(--panel-strong)",
                  border: "0.5px solid var(--line)",
                  color: "var(--accent)"
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="card-actions">
          {item.link && (
            <a className="btn primary" href={item.link} target="_blank" rel="noreferrer">
              Demo
            </a>
          )}
          {item.github && (
            <a className="btn" href={item.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
