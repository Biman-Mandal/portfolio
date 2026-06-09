import ProjectCard from './ProjectCard';
export default function ProjectsSection({ id, title, kicker, items = [] }) {
  if (!items.length) return null;

  return (
    <section id={id} className="section projects">
      <div className="section-header reveal">
        <div>
          <h2>{title}</h2>
          <p>{kicker}</p>
        </div>
      </div>
      <div className="grid">
        {items.map((item, index) => {
          const delayClass = `reveal-delay-${(index % 3) + 1}`;
          return <ProjectCard item={item} delayClass={delayClass} key={item.id} />;
        })}
      </div>
    </section>
  );
}
