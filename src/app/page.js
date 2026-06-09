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
  title: "Professional Full Stack Developer Portfolio | Next.js & Three.js",
  description: "Browse full stack web development projects, credentials, and courses. Powered by an interactive 3D hero scene and MySQL backend.",
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
          <span className="brand-mark">FS</span>
          <span>Portfolio</span>
        </a>
        <div className="nav-links">
          <a href="#projects" id="nav-projects-link">Projects</a>
          <a href="#certificates" id="nav-certs-link">Certificates</a>
          <a href="#courses" id="nav-courses-link">Courses</a>
          <a href="#education" id="nav-edu-link">Education</a>
          <a href="#about" id="nav-about-link">About</a>
          <a href="#contact" id="nav-contact-link">Contact</a>
          <a href="/admin" id="nav-admin-link">Admin</a>

        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-layout">
          <div className="hero-content">
            <span className="eyebrow reveal">Next.js | MySQL | Three.js</span>
            <h1 className="reveal reveal-delay-1">{intro.title}</h1>
            <p className="reveal reveal-delay-2">{intro.description}</p>
            <div className="hero-actions reveal reveal-delay-3">
              <a className="btn primary" href="#projects">
                View Projects
              </a>
              <a className="btn" href="#contact">
                Contact
              </a>
            </div>
            <div className="stack-strip reveal reveal-delay-4" aria-label="Developer stack">
              <span>React</span>
              <span>Next.js</span>
              <span>Node.js</span>
              <span>MySQL</span>
              <span>Three.js</span>
              <span>REST APIs</span>
            </div>
          </div>
          <InteractiveCodeWindow>
            <div className="code-titlebar">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span>portfolio.config.js</span>
            </div>
            <pre className="code-block">
              <code>
                <span className="code-key">const</span> developer = {"{"}
                {"\n"}  role: <span className="code-string">"Full Stack Developer"</span>,
                {"\n"}  frontend: [<span className="code-string">"Next.js"</span>, <span className="code-string">"Three.js"</span>],
                {"\n"}  backend: [<span className="code-string">"Node.js"</span>, <span className="code-string">"MySQL"</span>],
                {"\n"}  build: <span className="code-fn">shipCleanProducts</span>()
                {"\n"}
                {"};"}
              </code>
            </pre>
          </InteractiveCodeWindow>
        </div>
      </section>

      <ProjectsSection id="projects" title="Projects" kicker="Selected full stack builds with uploadable images, videos, links, and descriptions." items={byType(content, "project")} />
      <CertificatesSection id="certificates" title="Certificates" kicker="Proof of learning, achievements, and professional credentials." items={byType(content, "certificate")} />
      <CoursesSection id="courses" title="Courses" kicker="Courses and training that support the technical stack." items={byType(content, "course")} />
      <EducationSection id="education" title="Education" kicker="Education history, degrees, and academic milestones." items={byType(content, "education")} />

      {about ? (
        <AboutSection id="about" title={about.title} description={about.description} />
      ) : null}

      <ContactSection contact={contact} />
      <footer className="footer">Built with Next.js, Three.js, and MySQL.</footer>
    </main>
  );
}
