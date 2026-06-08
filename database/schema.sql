CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS portfolio_profile (
  id TINYINT PRIMARY KEY DEFAULT 1,
  full_name VARCHAR(160) NOT NULL,
  headline VARCHAR(255) NOT NULL,
  bio TEXT,
  email VARCHAR(180),
  phone VARCHAR(60),
  location VARCHAR(180),
  map_embed_url TEXT,
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  resume_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT one_profile CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS site_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_key ENUM('intro', 'about', 'contact') NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media JSON,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  tech_stack JSON,
  media JSON,
  live_url VARCHAR(500),
  repo_url VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  status ENUM('draft', 'published') DEFAULT 'published',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_projects_status_sort (status, sort_order, created_at)
);

CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(180),
  issued_at DATE,
  credential_id VARCHAR(180),
  credential_url VARCHAR(500),
  description TEXT,
  media JSON,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_certificate (title, issuer),
  INDEX idx_certificates_sort (sort_order, issued_at)
);

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  provider VARCHAR(180),
  description TEXT,
  started_at DATE,
  completed_at DATE,
  link VARCHAR(500),
  media JSON,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_course (title, provider)
);

CREATE TABLE IF NOT EXISTS education (
  id INT AUTO_INCREMENT PRIMARY KEY,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255),
  field_of_study VARCHAR(255),
  start_year SMALLINT,
  end_year SMALLINT,
  description TEXT,
  link VARCHAR(500),
  media JSON,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_education (institution, degree, field_of_study)
);

INSERT INTO portfolio_profile (id, full_name, headline, bio, email, phone, location, map_embed_url, github_url, linkedin_url, resume_url)
VALUES
(1, 'Your Name', 'Full Stack Developer', 'I build production-ready web apps, APIs, dashboards, and admin systems with Next.js, Node.js, MySQL, and clean UI engineering.', 'hello@example.com', '+91 00000 00000', 'Kolkata, India', 'https://www.google.com/maps?q=Kolkata%2C%20India&output=embed', 'https://github.com/', 'https://www.linkedin.com/', '#')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  headline = VALUES(headline),
  bio = VALUES(bio),
  email = VALUES(email),
  phone = VALUES(phone),
  location = VALUES(location),
  map_embed_url = VALUES(map_embed_url);

INSERT INTO site_sections (section_key, title, description, media, sort_order)
VALUES
('intro', 'Full Stack Developer', 'I design and build fast, manageable web products with polished frontends, strong APIs, database-backed admin panels, and deployment-ready structure.', JSON_ARRAY(), 1),
('about', 'About Me', 'I am a full stack developer focused on practical product engineering: Next.js interfaces, Node.js APIs, MySQL databases, admin dashboards, authentication, uploads, and clean deployment workflows.', JSON_ARRAY(), 2),
('contact', 'Contact', 'Email: hello@example.com | Phone: +91 00000 00000', JSON_ARRAY(), 7)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  sort_order = VALUES(sort_order);

INSERT INTO projects (title, slug, description, tech_stack, media, live_url, repo_url, featured, sort_order)
VALUES
('Portfolio CMS', 'portfolio-cms', 'A Next.js and MySQL portfolio with Three.js hero, public pages, admin dashboard, media uploads, and content management.', JSON_ARRAY('Next.js', 'React', 'MySQL', 'Three.js'), JSON_ARRAY(), '#', '#', TRUE, 1),
('Ecommerce Dashboard', 'ecommerce-dashboard', 'Admin dashboard concept for products, orders, analytics, and customer management.', JSON_ARRAY('Next.js', 'Node.js', 'MySQL'), JSON_ARRAY(), '#', '#', TRUE, 2)
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  tech_stack = VALUES(tech_stack),
  live_url = VALUES(live_url),
  repo_url = VALUES(repo_url);

INSERT INTO certificates (title, issuer, issued_at, credential_id, credential_url, description, media, sort_order)
VALUES
('Full Stack Development', 'Developer Academy', '2025-01-15', 'FSD-001', '#', 'Completed a full stack development program covering frontend, backend, database, and deployment fundamentals.', JSON_ARRAY(), 1),
('Modern React', 'Web Skills Lab', '2025-05-20', 'REACT-101', '#', 'React, hooks, component architecture, and production UI patterns.', JSON_ARRAY(), 2)
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  credential_url = VALUES(credential_url),
  sort_order = VALUES(sort_order);

INSERT INTO courses (title, provider, description, started_at, completed_at, link, media, sort_order)
VALUES
('Advanced Next.js', 'Online Course', 'Server components, API routes, production rendering, and deployment workflows.', '2025-02-01', '2025-03-01', '#', JSON_ARRAY(), 1),
('Database Design with MySQL', 'Online Course', 'Relational schema design, indexes, joins, and production data modeling.', '2025-04-01', '2025-04-20', '#', JSON_ARRAY(), 2)
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  link = VALUES(link),
  sort_order = VALUES(sort_order);

INSERT INTO education (institution, degree, field_of_study, start_year, end_year, description, link, media, sort_order)
VALUES
('Your College or University', 'Bachelor Degree', 'Computer Science', 2021, 2025, 'Studied software engineering, databases, web technologies, and application development.', '#', JSON_ARRAY(), 1)
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  link = VALUES(link),
  sort_order = VALUES(sort_order);
