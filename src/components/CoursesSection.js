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
          return (
            <div className={`course-card reveal ${delayClass}`} key={item.id}>
              <div className="course-header">
                <span className="course-dot" />
                <h3>{item.title}</h3>
              </div>
              {item.description ? <p className="course-desc">{item.description}</p> : null}
              {item.link ? (
                <a className="course-link" href={item.link} target="_blank" rel="noreferrer">
                  Course syllabus &rarr;
                </a>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
