import mysql from "mysql2/promise";

export function getPool() {
  if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "portfolio_db",
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true
    });
  }

  return global._mysqlPool;
}

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

  return {
    ...row,
    media
  };
}

export function parseMedia(media) {
  if (Array.isArray(media)) return media;
  if (!media) return [];

  try {
    return JSON.parse(media);
  } catch {
    return [];
  }
}

export function parseGenericId(id) {
  const [type, rawId] = String(id || "").split(":");
  return { type, id: Number(rawId) };
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

export async function getAllPortfolioContent() {
  const pool = getPool();
  const [sections] = await pool.query("SELECT * FROM site_sections ORDER BY sort_order ASC");
  const [profileRows] = await pool.query("SELECT * FROM portfolio_profile WHERE id = 1 LIMIT 1");
  const [projects] = await pool.query("SELECT * FROM projects WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC");
  const [certificates] = await pool.query("SELECT * FROM certificates ORDER BY sort_order ASC, issued_at DESC, created_at DESC");
  const [courses] = await pool.query("SELECT * FROM courses ORDER BY sort_order ASC, completed_at DESC, created_at DESC");
  const [education] = await pool.query("SELECT * FROM education ORDER BY sort_order ASC, start_year DESC, created_at DESC");

  const sectionByKey = Object.fromEntries(sections.map((section) => [section.section_key, section]));
  const profile = profileRows[0];
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
          location: profile.location || "",
          map_embed_url: profile.map_embed_url || "",
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
