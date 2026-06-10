import staticData from "@/data/static-data.json";
import { createClient } from "@supabase/supabase-js";

// Cache for connection instances
let _mysqlPool = null;
let _supabaseClient = null;

function isNodeRuntime() {
  return typeof process !== "undefined" && !!process.versions?.node;
}

function cloneStaticData() {
  return JSON.parse(JSON.stringify(staticData));
}

// --------------------------------------------------------
// 1. Connection Initializers
// --------------------------------------------------------

export async function getPool() {
  if (!_mysqlPool) {
    _mysqlPool = import("mysql2/promise").then((mysql) =>
      mysql.createPool({
        host: process.env.MYSQL_HOST || "localhost",
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "portfolio_db",
        waitForConnections: true,
        connectionLimit: 10,
        namedPlaceholders: true
      })
    );
  }
  return _mysqlPool;
}

export function getSupabaseClient() {
  if (!_supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;
    if (supabaseUrl && supabaseKey) {
      _supabaseClient = createClient(supabaseUrl, supabaseKey);
    }
  }
  return _supabaseClient;
}

// --------------------------------------------------------
// 2. Provider Detection & Diagnostics
// --------------------------------------------------------

export function getProvider() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;
  if (supabaseUrl && supabaseKey) {
    return "supabase";
  }
  if (process.env.MYSQL_HOST) {
    return "mysql";
  }
  return "static";
}

export function getDatabaseStatus() {
  const provider = getProvider();
  if (provider === "supabase") return "Supabase (PostgreSQL)";
  if (provider === "mysql") return "MySQL";
  return "Static File (local JSON)";
}

// --------------------------------------------------------
// 3. Fallback Wrapper
// --------------------------------------------------------

async function runWithFallback(opName, supabaseOp, mysqlOp, staticOp) {
  const provider = getProvider();

  if (provider === "supabase") {
    try {
      return await supabaseOp();
    } catch (err) {
      console.warn(`Supabase operation '${opName}' failed. Falling back to local static data. Error:`, err);
      try {
        return await staticOp();
      } catch (fallbackErr) {
        console.error(`Static fallback failed after Supabase error:`, fallbackErr);
        throw err;
      }
    }
  }

  if (provider === "mysql") {
    try {
      return await mysqlOp();
    } catch (err) {
      console.warn(`MySQL operation '${opName}' failed. Falling back to local static data. Error:`, err);
      try {
        return await staticOp();
      } catch (fallbackErr) {
        console.error(`Static fallback failed after MySQL error:`, fallbackErr);
        throw err;
      }
    }
  }

  try {
    return await staticOp();
  } catch (err) {
    console.error(`Static JSON operation '${opName}' failed:`, err);
    throw err;
  }
}

// --------------------------------------------------------
// 4. Local File Helper Functions
// --------------------------------------------------------

async function readStaticFile() {
  return cloneStaticData();
}

async function writeStaticFile(data) {
  if (!isNodeRuntime()) {
    throw new Error("Static file writes are not available in this runtime. Configure Supabase or MySQL for updates.");
  }

  const fs = await import("fs/promises");
  const path = await import("path");
  const staticFilePath = path.join(process.cwd(), "src", "data", "static-data.json");
  await fs.mkdir(path.dirname(staticFilePath), { recursive: true });
  await fs.writeFile(staticFilePath, JSON.stringify(data, null, 2), "utf8");
}

// --------------------------------------------------------
// 5. Utility Data Parsers
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
// 6. DB Core Implementation Functions
// --------------------------------------------------------

export async function getAllPortfolioContent() {
  return runWithFallback(
    "getAllPortfolioContent",
    // Supabase
    async () => {
      const client = getSupabaseClient();
      const [sectionsRes, profileRes, projectsRes, certsRes, coursesRes, eduRes] = await Promise.all([
        client.from("site_sections").select("*").order("sort_order", { ascending: true }),
        client.from("portfolio_profile").select("*").eq("id", 1).maybeSingle(),
        client.from("projects").select("*").eq("status", "published").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
        client.from("certificates").select("*").order("sort_order", { ascending: true }).order("issued_at", { ascending: false }).order("created_at", { ascending: false }),
        client.from("courses").select("*").order("sort_order", { ascending: true }).order("completed_at", { ascending: false }).order("created_at", { ascending: false }),
        client.from("education").select("*").order("sort_order", { ascending: true }).order("start_year", { ascending: false }).order("created_at", { ascending: false })
      ]);

      if (sectionsRes.error) throw sectionsRes.error;
      if (projectsRes.error) throw projectsRes.error;
      if (certsRes.error) throw certsRes.error;
      if (coursesRes.error) throw coursesRes.error;
      if (eduRes.error) throw eduRes.error;

      const sections = sectionsRes.data || [];
      const profile = profileRes.data || null;
      const projects = projectsRes.data || [];
      const certificates = certsRes.data || [];
      const courses = coursesRes.data || [];
      const education = eduRes.data || [];

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
    },
    // MySQL
    async () => {
      const pool = await getPool();
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
              email: profile.email || "",
              phone: profile.phone || "",
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
    },
    // Static Fallback
    async () => {
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
  );
}

export async function createPortfolioContent(type, data) {
  return runWithFallback(
    "createPortfolioContent",
    // Supabase
    async () => {
      const client = getSupabaseClient();
      const media = Array.isArray(data.media) ? data.media : [];
      let insertData = {};
      let table = "";

      if (type === "project") {
        table = "projects";
        insertData = {
          title: data.title || "Untitled Project",
          slug: `${slugify(data.title)}-${Date.now()}`,
          description: data.description || "",
          media: media,
          tech_stack: data.tech_stack || [],
          live_url: data.link || null,
          sort_order: Number(data.sort_order || 0),
          status: "published"
        };
      } else if (type === "certificate") {
        table = "certificates";
        insertData = {
          title: data.title || "Untitled Certificate",
          description: data.description || "",
          credential_url: data.link || null,
          media: media,
          sort_order: Number(data.sort_order || 0)
        };
      } else if (type === "course") {
        table = "courses";
        insertData = {
          title: data.title || "Untitled Course",
          description: data.description || "",
          link: data.link || null,
          media: media,
          sort_order: Number(data.sort_order || 0)
        };
      } else if (type === "education") {
        table = "education";
        insertData = {
          institution: data.title || "Untitled Education",
          description: data.description || "",
          link: data.link || null,
          media: media,
          sort_order: Number(data.sort_order || 0)
        };
      } else {
        throw new Error("Unsupported type for creation: " + type);
      }

      const { data: inserted, error } = await client.from(table).insert(insertData).select().single();
      if (error) throw error;
      return toGeneric(type, inserted);
    },
    // MySQL
    async () => {
      const pool = await getPool();
      const media = Array.isArray(data.media) ? data.media : [];
      let result, rows;

      if (type === "project") {
        [result] = await pool.query(
          `INSERT INTO projects (title, slug, description, media, live_url, sort_order) VALUES (?, ?, ?, CAST(? AS JSON), ?, ?)`,
          [data.title || "Untitled Project", `${slugify(data.title)}-${Date.now()}`, data.description || "", JSON.stringify(media), data.link || null, Number(data.sort_order || 0)]
        );
        [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [result.insertId]);
        return toGeneric("project", rows[0]);
      } else if (type === "certificate") {
        [result] = await pool.query(
          `INSERT INTO certificates (title, description, credential_url, media, sort_order) VALUES (?, ?, ?, CAST(? AS JSON), ?)`,
          [data.title || "Untitled Certificate", data.description || "", data.link || null, JSON.stringify(media), Number(data.sort_order || 0)]
        );
        [rows] = await pool.query("SELECT * FROM certificates WHERE id = ?", [result.insertId]);
        return toGeneric("certificate", rows[0]);
      } else if (type === "course") {
        [result] = await pool.query(
          `INSERT INTO courses (title, description, link, media, sort_order) VALUES (?, ?, ?, CAST(? AS JSON), ?)`,
          [data.title || "Untitled Course", data.description || "", data.link || null, JSON.stringify(media), Number(data.sort_order || 0)]
        );
        [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [result.insertId]);
        return toGeneric("course", rows[0]);
      } else if (type === "education") {
        [result] = await pool.query(
          `INSERT INTO education (institution, description, link, media, sort_order) VALUES (?, ?, ?, CAST(? AS JSON), ?)`,
          [data.title || "Untitled Education", data.description || "", data.link || null, JSON.stringify(media), Number(data.sort_order || 0)]
        );
        [rows] = await pool.query("SELECT * FROM education WHERE id = ?", [result.insertId]);
        return toGeneric("education", rows[0]);
      }
    },
    // Static Fallback
    async () => {
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
      }

      if (!db[table]) db[table] = [];
      db[table].push(item);
      await writeStaticFile(db);
      return toGeneric(type, item);
    }
  );
}

export async function updatePortfolioContent(type, id, data) {
  return runWithFallback(
    "updatePortfolioContent",
    // Supabase
    async () => {
      const client = getSupabaseClient();
      const media = Array.isArray(data.media) ? data.media : [];
      let updateData = {};
      let table = "";

      if (type === "project") {
        table = "projects";
        updateData = {
          title: data.title || "Untitled Project",
          description: data.description || "",
          media: media,
          live_url: data.link || null,
          sort_order: Number(data.sort_order || 0)
        };
      } else if (type === "certificate") {
        table = "certificates";
        updateData = {
          title: data.title || "Untitled Certificate",
          description: data.description || "",
          credential_url: data.link || null,
          media: media,
          sort_order: Number(data.sort_order || 0)
        };
      } else if (type === "course") {
        table = "courses";
        updateData = {
          title: data.title || "Untitled Course",
          description: data.description || "",
          link: data.link || null,
          media: media,
          sort_order: Number(data.sort_order || 0)
        };
      } else if (type === "education") {
        table = "education";
        updateData = {
          institution: data.title || "Untitled Education",
          description: data.description || "",
          link: data.link || null,
          media: media,
          sort_order: Number(data.sort_order || 0)
        };
      }

      const { data: updated, error } = await client.from(table).update(updateData).eq("id", id).select().single();
      if (error) throw error;
      return toGeneric(type, updated);
    },
    // MySQL
    async () => {
      const pool = await getPool();
      const media = Array.isArray(data.media) ? data.media : [];
      let rows;

      if (type === "project") {
        await pool.query(
          `UPDATE projects SET title = ?, description = ?, live_url = ?, media = CAST(? AS JSON), sort_order = ? WHERE id = ?`,
          [data.title || "Untitled Project", data.description || "", data.link || null, JSON.stringify(media), Number(data.sort_order || 0), id]
        );
        [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);
        return toGeneric("project", rows[0]);
      } else if (type === "certificate") {
        await pool.query(
          `UPDATE certificates SET title = ?, description = ?, credential_url = ?, media = CAST(? AS JSON), sort_order = ? WHERE id = ?`,
          [data.title || "Untitled Certificate", data.description || "", data.link || null, JSON.stringify(media), Number(data.sort_order || 0), id]
        );
        [rows] = await pool.query("SELECT * FROM certificates WHERE id = ?", [id]);
        return toGeneric("certificate", rows[0]);
      } else if (type === "course") {
        await pool.query(
          `UPDATE courses SET title = ?, description = ?, link = ?, media = CAST(? AS JSON), sort_order = ? WHERE id = ?`,
          [data.title || "Untitled Course", data.description || "", data.link || null, JSON.stringify(media), Number(data.sort_order || 0), id]
        );
        [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);
        return toGeneric("course", rows[0]);
      } else if (type === "education") {
        await pool.query(
          `UPDATE education SET institution = ?, description = ?, link = ?, media = CAST(? AS JSON), sort_order = ? WHERE id = ?`,
          [data.title || "Untitled Education", data.description || "", data.link || null, JSON.stringify(media), Number(data.sort_order || 0), id]
        );
        [rows] = await pool.query("SELECT * FROM education WHERE id = ?", [id]);
        return toGeneric("education", rows[0]);
      }
    },
    // Static Fallback
    async () => {
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
  );
}

export async function deletePortfolioContent(type, id) {
  return runWithFallback(
    "deletePortfolioContent",
    // Supabase
    async () => {
      const client = getSupabaseClient();
      const tableByType = {
        project: "projects",
        certificate: "certificates",
        course: "courses",
        education: "education"
      };
      const { error } = await client.from(tableByType[type]).delete().eq("id", id);
      if (error) throw error;
      return { ok: true };
    },
    // MySQL
    async () => {
      const tableByType = {
        project: "projects",
        certificate: "certificates",
        course: "courses",
        education: "education"
      };
      const pool = await getPool();
      await pool.query(`DELETE FROM ${tableByType[type]} WHERE id = ?`, [id]);
      return { ok: true };
    },
    // Static Fallback
    async () => {
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
  );
}

export async function upsertSingleton(type, data) {
  return runWithFallback(
    "upsertSingleton",
    // Supabase
    async () => {
      const client = getSupabaseClient();
      const media = Array.isArray(data.media) ? data.media : [];

      if (type === "contact") {
        const { error: secError } = await client.from("site_sections").upsert({
          section_key: "contact",
          title: data.title || "Contact",
          description: data.description || "",
          media: media,
          sort_order: Number(data.sort_order || 7)
        }, { onConflict: "section_key" });
        if (secError) throw secError;

        const { error: profError } = await client.from("portfolio_profile").upsert({
          id: 1,
          full_name: "Biman Mandal",
          headline: "Senior Web Developer",
          bio: "I am a Senior Software Developer with 4+ years of experience in designing, developing, and maintaining scalable web applications and APIs. Currently working as a Lead Backend Developer, I specialize in Node.js (Express.js), TypeScript, MongoDB, PHP (Laravel), and MySQL, with hands-on experience across full-stack technologies.",
          location: data.location || null,
          map_embed_url: data.map_embed_url || null
        }, { onConflict: "id" });
        if (profError) throw profError;
      } else {
        const { error: secError } = await client.from("site_sections").upsert({
          section_key: type,
          title: data.title || type,
          description: data.description || "",
          media: media,
          sort_order: Number(data.sort_order || 0)
        }, { onConflict: "section_key" });
        if (secError) throw secError;
      }
    },
    // MySQL
    async () => {
      const pool = await getPool();
      const media = Array.isArray(data.media) ? data.media : [];

      if (type === "contact") {
        await pool.query(
          `INSERT INTO site_sections (section_key, title, description, media, sort_order)
           VALUES ('contact', ?, ?, CAST(? AS JSON), ?)
           ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), media = VALUES(media), sort_order = VALUES(sort_order)`,
          [data.title || "Contact", data.description || "", JSON.stringify(media), Number(data.sort_order || 7)]
        );
        await pool.query(
          `INSERT INTO portfolio_profile (id, full_name, headline, bio, email, phone, location, map_embed_url)
           VALUES (1, 'Your Name', 'Full Stack Developer', '', NULL, NULL, ?, ?)
           ON DUPLICATE KEY UPDATE location = VALUES(location), map_embed_url = VALUES(map_embed_url)`,
          [data.location || null, data.map_embed_url || null]
        );
      } else {
        await pool.query(
          `INSERT INTO site_sections (section_key, title, description, media, sort_order)
           VALUES (?, ?, ?, CAST(? AS JSON), ?)
           ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), media = VALUES(media), sort_order = VALUES(sort_order)`,
          [type, data.title || type, data.description || "", JSON.stringify(media), Number(data.sort_order || 0)]
        );
      }
    },
    // Static Fallback
    async () => {
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
  );
}
