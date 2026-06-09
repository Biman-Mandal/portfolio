export default function CoursesSection({ id, title, kicker, items = [] }) {
  if (!items.length) return null;

  return (
    <section id={id} className="section">
      <div className="section-header reveal">
        <div>
          <h2>{title}</h2>
          <p>{kicker}</p>
        </div>
      </div>
      <div className="courses-grid">
        {items.map((item, index) => {
          const delayClass = `reveal-delay-${(index % 3) + 1}`;
          const firstMedia = item.media?.[0];
          const isVideo = firstMedia?.type?.startsWith("video");
          const CardContainer = item.link ? 'a' : 'div';
          const cardProps = item.link ? { href: item.link, target: "_blank", rel: "noreferrer", style: { textDecoration: 'none', color: 'inherit' } } : {};

          return (
            <CardContainer className={`course-card reveal ${delayClass}`} key={item.id} {...cardProps}>
              {firstMedia ? (
                <div className="media-frame">
                  {isVideo ? (
                    <video src={firstMedia.url} controls muted />
                  ) : (
                    <img src={firstMedia.url} alt={item.title} />
                  )}
                </div>
              ) : null}
              <div className="course-header">
                <span className="course-dot" />
                <h3>{item.title}</h3>
              </div>
              {item.description ? <p className="course-desc">{item.description}</p> : null}
              {item.link ? (
                <span className="course-link">
                  Course syllabus &rarr;
                </span>
              ) : null}
            </CardContainer>
          );
        })}
      </div>
    </section>
  );
}
