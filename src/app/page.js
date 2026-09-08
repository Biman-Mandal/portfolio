import ContactSection from "@/components/ContactSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificatesSection from "@/components/CertificatesSection";
import CoursesSection from "@/components/CoursesSection";
import EducationSection from "@/components/EducationSection";
import AboutSection from "@/components/AboutSection";

import InteractiveCodeWindow from "@/components/InteractiveCodeWindow";
import { getAllPortfolioContent } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export const metadata = {
  title: "Professional Full Stack Developer Portfolio",
  description: "Browse full stack web development projects, credentials, and courses. Powered by an interactive 3D hero scene and local JSON database.",
  robots: "index, follow"
};

async function getContent() {
  try {
    return await getAllPortfolioContent();
  } catch {
    return [];
  }
}

function byType(items, type) {
  return items.filter((item) => item.type === type);
}

export default async function Home() {
  const content = await getContent();
  const intro = byType(content, "intro")[0] || {
    title: "Full Stack Developer",
    description: "I build fast web apps, admin systems, APIs, and product interfaces with Next.js, Node.js, MySQL, and Three.js."
  };
  const about = byType(content, "about")[0];
  const contact = byType(content, "contact")[0];

  return (
    <main className="site-shell">
      <nav className="top-nav">
        <a className="brand" href="#home" id="brand-logo-link">
          <img src="/logo.jpg" alt="BM Logo" style={{ height: "32px", width: "32px", borderRadius: "8px", objectFit: "cover" }} />
          <span>Biman Mandal</span>
        </a>
        <div className="nav-links">
          <a href="#projects" id="nav-projects-link">Projects</a>
          <a href="#education" id="nav-edu-link">Experience</a>
          <a href="#about" id="nav-about-link">About</a>
          <a href="#contact" id="nav-contact-link">Contact</a>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-layout">
          <div className="hero-content">
            <span className="eyebrow reveal">Senior Software Developer | Full Stack Engineer</span>
            <h1 className="reveal reveal-delay-1">{intro.title}</h1>
            <p className="reveal reveal-delay-2">{intro.description}</p>
            
            <div className="hero-actions reveal reveal-delay-3">
              <a className="btn primary" href="#projects">
                View Projects &rarr;
              </a>
              <a className="btn" href="#contact">
                Get In Touch
              </a>
            </div>

            <div className="hero-stats reveal reveal-delay-3">
              <div className="stat-item">
                <span className="stat-num">4+</span>
                <span className="stat-label">Years Exp.</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">15+</span>
                <span className="stat-label">SaaS & Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">Production Delivery</span>
              </div>
            </div>

            <div className="stack-strip reveal reveal-delay-4" aria-label="Core developer stack">
              <span>Node.js / Express</span>
              <span>Laravel / PHP</span>
              <span>Next.js / React</span>
              <span>MongoDB</span>
              <span>MySQL</span>
              <span>Socket.IO</span>
              <span>REST APIs</span>
              <span>Docker</span>
            </div>
          </div>

          <InteractiveCodeWindow>
            <div className="code-titlebar">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span>portfolio.config.ts</span>
            </div>
            <pre className="code-block">
              <code>
                <span className="code-key">const</span> engineer = {"{"}
                {"\n"}  name: <span className="code-string">"Biman Mandal"</span>,
                {"\n"}  role: <span className="code-string">"Lead Backend & Full Stack"</span>,
                {"\n"}  architecture: [<span className="code-string">"Microservices"</span>, <span className="code-string">"SaaS"</span>],
                {"\n"}  backend: [<span className="code-string">"Laravel/PHP"</span>, <span className="code-string">"Node.js/Express"</span>],
                {"\n"}  databases: [<span className="code-string">"MySQL"</span>, <span className="code-string">"MongoDB"</span>],
                {"\n"}  frontend: [<span className="code-string">"Next.js"</span>, <span className="code-string">"React"</span>],
                {"\n"}  status: <span className="code-fn">availableForImpact</span>()
                {"\n"}
                {"};"}
              </code>
            </pre>
          </InteractiveCodeWindow>
        </div>
      </section>

      <ProjectsSection id="projects" title="Featured Projects" kicker="Scalable SaaS platforms, real-time logistics systems, and enterprise web solutions." items={byType(content, "project")} />
      <EducationSection id="education" title="Career Experience" kicker="A timeline of professional software engineering roles and technical achievements." items={byType(content, "education")} />

      {about ? (
        <AboutSection id="about" title={about.title} description={about.description} certificates={byType(content, "certificate")} courses={byType(content, "course")} />
      ) : null}

      <ContactSection contact={contact} />
      <footer className="footer">
        © {new Date().getFullYear()} Biman Mandal. Engineered with Next.js, Three.js & Modern UI Design.
      </footer>
    </main>
  );
}
