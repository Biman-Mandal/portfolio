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
(1, 'Biman Mandal', 'Senior Web Developer', 'I am a Senior Software Developer with 4+ years of experience in designing, developing, and maintaining scalable web applications and APIs. Currently working as a Lead Backend Developer, I specialize in Node.js (Express.js), TypeScript, MongoDB, PHP (Laravel), and MySQL, with hands-on experience across full-stack technologies.', 'bimanm193@gmail.com', '+91 62940 67811', 'Kolkata, West Bengal, India', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.093557088927!2d88.363895!3d22.572646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3adc8b5dfbefffff%3A0x1d4e0e5a6f2ea8b0!2sKolkata%2C%20West%20Bengal%2C%20India!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin', 'https://github.com/im-bimanmandal', 'https://www.linkedin.com/in/im-bimanmandal', '#')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  headline = VALUES(headline),
  bio = VALUES(bio),
  email = VALUES(email),
  phone = VALUES(phone),
  location = VALUES(location),
  map_embed_url = VALUES(map_embed_url),
  github_url = VALUES(github_url),
  linkedin_url = VALUES(linkedin_url);

INSERT INTO site_sections (section_key, title, description, media, sort_order)
VALUES
('intro', 'Biman Mandal', 'Senior Web Developer & Lead Backend Developer building high-performance APIs, scalable database architectures, and production-ready applications with Laravel, Node.js, and React.', JSON_ARRAY(), 1),
('about', 'About Me', 'I am a Senior Software Developer with 4+ years of experience. I specialize in designing and maintaining scalable backend systems, database schemas, and clean frontend integrations using PHP/Laravel, Node.js (Express), MongoDB, and MySQL.', JSON_ARRAY(), 2),
('contact', 'Contact', 'Email: bimanm193@gmail.com | Phone: +91 62940 67811', JSON_ARRAY(), 7)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  sort_order = VALUES(sort_order);

DELETE FROM projects;
INSERT INTO projects (title, slug, description, tech_stack, media, live_url, repo_url, featured, sort_order)
VALUES
('OCHats', 'ochats', 'Omnichannel Customer Communication CRM SaaS allowing businesses to manage customer conversations across 14+ messaging platforms (WhatsApp, Messenger, Instagram, LINE, WeChat, Email) from a single inbox. Features visual drag-and-drop workflow builders (Drawflow), timezone-aware queue broadcasts, contact intelligence/merging, and Stripe subscription systems.', JSON_ARRAY('Laravel', 'PHP', 'MySQL', 'Livewire', 'Redis', 'Stripe'), JSON_ARRAY(JSON_OBJECT('url', '/uploads/ochats.png', 'name', 'ochats.png', 'type', 'image')), 'https://www.app.ochats.io/', '#', TRUE, 1),
('Runway Hive', 'runway-hive', 'Global fashion-tech portal and e-commerce marketplace connecting models, designers, and photographers. Features advanced profile management, points-based rewards economy (gamification), multi-step job board and hiring dashboards, location-aware filters, and secure payments via Stripe and PayPal.', JSON_ARRAY('Next.js', 'React', 'Node.js', 'MongoDB', 'Mongoose', 'Stripe', 'PayPal'), JSON_ARRAY(JSON_OBJECT('url', '/uploads/runwayhive.png', 'name', 'runwayhive.png', 'type', 'image')), 'https://runwayhive.com/', '#', TRUE, 2),
('Maneuver', 'maneuver', 'On-demand courier delivery shipment platform featuring multi-stop route optimization, real-time GPS tracking (Socket.IO + Redis), intelligent proximity driver matching, dynamic pricing, and Stripe Identity document verification.', JSON_ARRAY('Node.js', 'Express', 'MySQL', 'Sequelize', 'Socket.io', 'Redis', 'Stripe Connect'), JSON_ARRAY(JSON_OBJECT('url', '/uploads/maneuver.png', 'name', 'maneuver.png', 'type', 'image')), 'https://maneuver.live', '#', TRUE, 3),
('ACC – SaaS Learning Management System', 'acc-lms', 'A SaaS-based education management ecosystem with Web app, mobile app, and admin portal enabling schools to manage students, courses, batches, attendance, exams, assignments, fees, results, and notifications.', JSON_ARRAY('Laravel', 'Livewire', 'MySQL', 'Bootstrap'), JSON_ARRAY(JSON_OBJECT('url', '/uploads/acc_lms.png', 'name', 'acc_lms.png', 'type', 'image')), '#', '#', TRUE, 4),
('Ayan Chakraborty Classes LMS', 'ayan-classes', 'Coaching institute Learning Management System featuring custom Zoom API live class scheduling, media video hosting on AWS S3 & Cloudflare R2, SMS alerts via Vonage, dynamic PDF assignments, and school reporting tools.', JSON_ARRAY('Laravel 12', 'Livewire 3', 'Tailwind CSS', 'Alpine.js', 'AWS S3', 'Cloudflare R2'), JSON_ARRAY(JSON_OBJECT('url', '/uploads/ayanclasses.png', 'name', 'ayanclasses.png', 'type', 'image')), 'https://admin.ayanchakrabortyclasses.co.in/admin/login', '#', TRUE, 5),
('Leroi Lead Operations Platform', 'leroi', 'Enterprise lead and operations management platform streamlining lead tracking, workflow automation, customer engagement, visual pipeline dashboards, team communication, and automated sales reporting.', JSON_ARRAY('Laravel', 'Livewire', 'PHP', 'Tailwind CSS', 'MySQL'), JSON_ARRAY(JSON_OBJECT('url', '/uploads/leroi.png', 'name', 'leroi.png', 'type', 'image')), '#', '#', TRUE, 6);

DELETE FROM certificates;
INSERT INTO certificates (title, issuer, issued_at, credential_id, credential_url, description, media, sort_order)
VALUES
('Lead Backend Developer Certification', 'Inforoot Solution', '2025-09-01', 'LEAD-BEND-09', '#', 'Recognition of leading backend architecture, REST API design, and system engineering.', JSON_ARRAY(), 1),
('SaaS Architecture & Project Delivery', 'Notebrains Software', '2025-03-01', 'SAAS-PROJ-03', '#', 'Design and delivery of multi-tenant platforms, socket tracking, and billing integrations.', JSON_ARRAY(), 2);

DELETE FROM courses;
INSERT INTO courses (title, provider, description, started_at, completed_at, link, media, sort_order)
VALUES
('Omnichannel Message Routing Systems', 'Internal Training', 'Architecting multi-platform message normalization engines and webhook handlers.', '2024-01-01', '2024-03-01', '#', JSON_ARRAY(), 1),
('Real-time Socket.io & Redis Caching', 'Advanced Technical Hub', 'Deploying Redis cache to minimize database hits in high-frequency location queries.', '2023-06-01', '2023-08-01', '#', JSON_ARRAY(), 2);

DELETE FROM education;
INSERT INTO education (institution, degree, field_of_study, start_year, end_year, description, link, media, sort_order)
VALUES
('Techno India (Hooghly Campus)', 'Bachelor of Computer Application (BCA)', 'Computer Application', 2017, 2020, 'Acquired base computer science knowledge, relational databases, web scripting languages, and application development fundamentals.', 'https://admin.ayanchakrabortyclasses.co.in/', JSON_ARRAY(), 1);
