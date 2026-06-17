import staticData from "@/data/static-data.json";

function isNodeRuntime() {
  return typeof process !== "undefined" && !!process.versions?.node;
}

function cloneStaticData() {
  return JSON.parse(JSON.stringify(staticData));
}

// --------------------------------------------------------
// Provider & Status Diagnostics
// --------------------------------------------------------

export function getProvider() {
  return "static";
}

export function getDatabaseStatus() {
  return "Static File (local JSON)";
}

// --------------------------------------------------------
// Local File Helper Functions
// --------------------------------------------------------

async function readStaticFile() {
  return cloneStaticData();
}

async function writeStaticFile(data) {
  if (!isNodeRuntime()) {
    throw new Error("Static file writes are not available in this runtime.");
  }

  const fs = await import("fs/promises");
  const path = await import("path");
  const staticFilePath = path.join(process.cwd(), "src", "data", "static-data.json");
  await fs.mkdir(path.dirname(staticFilePath), { recursive: true });
  await fs.writeFile(staticFilePath, JSON.stringify(data, null, 2), "utf8");
}

// --------------------------------------------------------
// Utility Data Parsers
// --------------------------------------------------------

export function parseContent(row) {
  let media = [];
  if (Array.isArray(row.media)) {
    media = row.media;
  } else if (row.media) {
    try {
      media = JSON.parse(row.media);
    } catch {
      media = [];
    }
  }
  return { ...row, media };
}

export function parseMedia(media) {
  if (Array.isArray(media)) return media;
  if (!media) return [];
  try {
    return typeof media === "string" ? JSON.parse(media) : media;
  } catch {
    return [];
  }
}

export function parseGenericId(id) {
  const [type, rawId] = String(id || "").split(":");
  return { type, id: Number(rawId) };
}

export function slugify(value = "") {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `project-${Date.now()}`;
}

export function toGeneric(type, row) {
  if (!row) return null;

  return {
    id: `${type}:${row.id}`,
    raw_id: row.id,
    type,
    title: row.title || row.institution || row.hero_title || row.full_name || "",
    description: row.description || row.bio || row.hero_subtitle || "",
    link: row.link || row.live_url || row.credential_url || row.resume_url || "",
    github: row.repo_url || "",
    location: row.location || "",
    map_embed_url: row.map_embed_url || "",
    media: parseMedia(row.media),
    tech_stack: row.tech_stack ? (typeof row.tech_stack === "string" ? JSON.parse(row.tech_stack) : row.tech_stack) : [],
    sort_order: row.sort_order || 0,
    start_year: row.start_year || null,
    end_year: row.end_year || null,
    degree: row.degree || "",
    field_of_study: row.field_of_study || "",
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

// --------------------------------------------------------
// DB Core Implementation Functions (Static Only)
// --------------------------------------------------------

export async function getAllPortfolioContent() {
  const db = await readStaticFile();
  const sections = db.site_sections || [];
  const profile = db.portfolio_profile?.[0] || null;
  const projects = (db.projects || []).filter(p => p.status === 'published');
  const certificates = db.certificates || [];
  const courses = db.courses || [];
  const education = db.education || [];

  sections.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  projects.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || new Date(b.created_at) - new Date(a.created_at));
  certificates.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || new Date(b.issued_at) - new Date(a.issued_at) || new Date(b.created_at) - new Date(a.created_at));
  courses.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || new Date(b.completed_at) - new Date(a.completed_at) || new Date(b.created_at) - new Date(a.created_at));
  education.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || (b.start_year || 0) - (a.start_year || 0) || new Date(b.created_at) - new Date(a.created_at));

  const sectionByKey = Object.fromEntries(sections.map((section) => [section.section_key, section]));
  const contactSection = sectionByKey.contact;

  const singletons = [
    sectionByKey.intro ? toGeneric("intro", sectionByKey.intro) : null,
    sectionByKey.about ? toGeneric("about", sectionByKey.about) : null,
    profile
      ? {
          id: "contact:1",
          raw_id: 1,
          type: "contact",
          title: contactSection?.title || "Contact",
          description: contactSection?.description || `Email: ${profile.email || ""} | Phone: ${profile.phone || ""}`,
          link: profile.email ? `mailto:${profile.email}` : profile.resume_url || "",
          email: profile.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          map_embed_url: profile.map_embed_url || "",
          linkedin_url: profile.linkedin_url || "https://www.linkedin.com/in/im-bimanmandal/",
          resume_url: profile.resume_url || "#",
          media: parseMedia(contactSection?.media),
          sort_order: contactSection?.sort_order || 0,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }
      : null
  ].filter(Boolean);

  return [
    ...singletons,
    ...projects.map((row) => toGeneric("project", row)),
    ...certificates.map((row) => toGeneric("certificate", row)),
    ...courses.map((row) => toGeneric("course", row)),
    ...education.map((row) => toGeneric("education", row))
  ];
}

export async function createPortfolioContent(type, data) {
  const db = await readStaticFile();
  const media = Array.isArray(data.media) ? data.media : [];
  let table = "";
  let item = {};

  if (type === "project") {
    table = "projects";
    item = {
      id: Math.max(...(db.projects || []).map(p => p.id), 0) + 1,
      title: data.title || "Untitled Project",
      slug: `${slugify(data.title)}-${Date.now()}`,
      description: data.description || "",
      media: media,
      tech_stack: data.tech_stack || [],
      live_url: data.link || null,
      sort_order: Number(data.sort_order || 0),
      status: "published",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else if (type === "certificate") {
    table = "certificates";
    item = {
      id: Math.max(...(db.certificates || []).map(c => c.id), 0) + 1,
      title: data.title || "Untitled Certificate",
      description: data.description || "",
      credential_url: data.link || null,
      media: media,
      sort_order: Number(data.sort_order || 0),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else if (type === "course") {
    table = "courses";
    item = {
      id: Math.max(...(db.courses || []).map(c => c.id), 0) + 1,
      title: data.title || "Untitled Course",
      description: data.description || "",
      link: data.link || null,
      media: media,
      sort_order: Number(data.sort_order || 0),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else if (type === "education") {
    table = "education";
    item = {
      id: Math.max(...(db.education || []).map(e => e.id), 0) + 1,
      institution: data.title || "Untitled Education",
      description: data.description || "",
      link: data.link || null,
      media: media,
      sort_order: Number(data.sort_order || 0),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else {
    throw new Error("Unsupported type for creation: " + type);
  }

  if (!db[table]) db[table] = [];
  db[table].push(item);
  await writeStaticFile(db);
  return toGeneric(type, item);
}

export async function updatePortfolioContent(type, id, data) {
  const db = await readStaticFile();
  const media = Array.isArray(data.media) ? data.media : [];
  let table = "";

  if (type === "project") table = "projects";
  else if (type === "certificate") table = "certificates";
  else if (type === "course") table = "courses";
  else if (type === "education") table = "education";

  const arr = db[table] || [];
  const idx = arr.findIndex(item => item.id === Number(id));
  if (idx === -1) throw new Error(`Record with id ${id} not found in static JSON table ${table}`);

  const original = arr[idx];
  let updated = {
    ...original,
    updated_at: new Date().toISOString()
  };

  if (type === "project") {
    updated.title = data.title || updated.title;
    updated.description = data.description || "";
    updated.media = media;
    updated.live_url = data.link || null;
    updated.sort_order = Number(data.sort_order || 0);
  } else if (type === "certificate") {
    updated.title = data.title || updated.title;
    updated.description = data.description || "";
    updated.credential_url = data.link || null;
    updated.media = media;
    updated.sort_order = Number(data.sort_order || 0);
  } else if (type === "course") {
    updated.title = data.title || updated.title;
    updated.description = data.description || "";
    updated.link = data.link || null;
    updated.media = media;
    updated.sort_order = Number(data.sort_order || 0);
  } else if (type === "education") {
    updated.institution = data.title || updated.institution;
    updated.description = data.description || "";
    updated.link = data.link || null;
    updated.media = media;
    updated.sort_order = Number(data.sort_order || 0);
  }

  arr[idx] = updated;
  await writeStaticFile(db);
  return toGeneric(type, updated);
}

export async function deletePortfolioContent(type, id) {
  const db = await readStaticFile();
  const tableByType = {
    project: "projects",
    certificate: "certificates",
    course: "courses",
    education: "education"
  };
  const table = tableByType[type];
  if (db[table]) {
    db[table] = db[table].filter(item => item.id !== Number(id));
    await writeStaticFile(db);
  }
  return { ok: true };
}

export async function upsertSingleton(type, data) {
  const db = await readStaticFile();
  const media = Array.isArray(data.media) ? data.media : [];

  if (!db.site_sections) db.site_sections = [];
  let secIdx = db.site_sections.findIndex(s => s.section_key === type);
  const sectionRecord = {
    id: secIdx !== -1 ? db.site_sections[secIdx].id : Math.max(...db.site_sections.map(s => s.id), 0) + 1,
    section_key: type,
    title: data.title || (type === "contact" ? "Contact" : type),
    description: data.description || "",
    media: media,
    sort_order: Number(data.sort_order || (type === "contact" ? 7 : 0)),
    updated_at: new Date().toISOString()
  };
  if (secIdx !== -1) {
    db.site_sections[secIdx] = sectionRecord;
  } else {
    db.site_sections.push(sectionRecord);
  }

  if (type === "contact") {
    if (!db.portfolio_profile) db.portfolio_profile = [];
    if (!db.portfolio_profile[0]) {
      db.portfolio_profile[0] = {
        id: 1,
        full_name: "Biman Mandal",
        headline: "Senior Web Developer",
        bio: "I am a Senior Software Developer with 4+ years of experience...",
        email: "bimanm193@gmail.com",
        phone: "+91 62940 67811",
        github_url: "https://github.com/im-bimanmandal",
        linkedin_url: "https://www.linkedin.com/in/im-bimanmandal",
        resume_url: "#"
      };
    }
    db.portfolio_profile[0].location = data.location || null;
    db.portfolio_profile[0].map_embed_url = data.map_embed_url || null;
    db.portfolio_profile[0].updated_at = new Date().toISOString();
  }
  await writeStaticFile(db);
}
