export default function PortfolioSection({ id, title, kicker, items = [], alternate = false }) {
  if (!items.length) return null;

  return (
    <section id={id} className={`section${alternate ? " alt" : ""}`}>
      <div className="section-header reveal">
        <div>
          <h2>{title}</h2>
          <p>{kicker}</p>
        </div>
      </div>
      <div className="grid">
        {items.map((item, index) => {
          const firstMedia = item.media?.[0];
          const isVideo = firstMedia?.type?.startsWith("video");
          const delayClass = `reveal-delay-${(index % 3) + 1}`;

          return (
            <article className={`content-card reveal ${delayClass}`} key={item.id}>
              {firstMedia ? (
                <div className="media-frame">
                  {isVideo ? (
                    <video src={firstMedia.url} controls muted />
                  ) : (
                    <img src={firstMedia.url} alt={item.title} />
                  )}
                </div>
              ) : null}
              <div className="card-body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.link ? (
                  <a className="link" href={item.link} target="_blank" rel="noreferrer">
                    View Link
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
