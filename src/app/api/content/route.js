import { NextResponse } from "next/server";
import { getAllPortfolioContent, getPool, toGeneric } from "@/lib/db";

export const dynamic = "force-dynamic";

function isAllowed(request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return true;
  return request.headers.get("x-admin-password") === password;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const content = await getAllPortfolioContent();
  return NextResponse.json(type ? content.filter((item) => item.type === type) : content);
}

export async function POST(request) {
  if (!isAllowed(request)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const body = await request.json();
  const pool = getPool();
  const media = Array.isArray(body.media) ? body.media : [];
  let result;
  let rows;

  if (body.type === "project") {
    [result] = await pool.query(
      `INSERT INTO projects (title, slug, description, media, live_url, sort_order)
       VALUES (?, ?, ?, CAST(? AS JSON), ?, ?)`,
      [body.title || "Untitled Project", `${slugify(body.title)}-${Date.now()}`, body.description || "", JSON.stringify(media), body.link || null, Number(body.sort_order || 0)]
    );
    [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [result.insertId]);
    return NextResponse.json(toGeneric("project", rows[0]), { status: 201 });
  }

  if (body.type === "certificate") {
    [result] = await pool.query(
      `INSERT INTO certificates (title, description, credential_url, media, sort_order)
       VALUES (?, ?, ?, CAST(? AS JSON), ?)`,
      [body.title || "Untitled Certificate", body.description || "", body.link || null, JSON.stringify(media), Number(body.sort_order || 0)]
    );
    [rows] = await pool.query("SELECT * FROM certificates WHERE id = ?", [result.insertId]);
    return NextResponse.json(toGeneric("certificate", rows[0]), { status: 201 });
  }

  if (body.type === "course") {
    [result] = await pool.query(
      `INSERT INTO courses (title, description, link, media, sort_order)
       VALUES (?, ?, ?, CAST(? AS JSON), ?)`,
      [body.title || "Untitled Course", body.description || "", body.link || null, JSON.stringify(media), Number(body.sort_order || 0)]
    );
    [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [result.insertId]);
    return NextResponse.json(toGeneric("course", rows[0]), { status: 201 });
  }

  if (body.type === "education") {
    [result] = await pool.query(
      `INSERT INTO education (institution, description, link, media, sort_order)
       VALUES (?, ?, ?, CAST(? AS JSON), ?)`,
      [body.title || "Untitled Education", body.description || "", body.link || null, JSON.stringify(media), Number(body.sort_order || 0)]
    );
    [rows] = await pool.query("SELECT * FROM education WHERE id = ?", [result.insertId]);
    return NextResponse.json(toGeneric("education", rows[0]), { status: 201 });
  }

  if (["intro", "about", "contact"].includes(body.type)) {
    await upsertSingleton(pool, body, media);
    const content = await getAllPortfolioContent();
    return NextResponse.json(content.find((item) => item.type === body.type), { status: 201 });
  }

  return NextResponse.json({ error: "Unsupported content type." }, { status: 400 });
}

function slugify(value = "") {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `project-${Date.now()}`;
}

async function upsertSingleton(pool, body, media) {
  if (body.type === "contact") {
    await pool.query(
      `INSERT INTO site_sections (section_key, title, description, media, sort_order)
       VALUES ('contact', ?, ?, CAST(? AS JSON), ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), media = VALUES(media), sort_order = VALUES(sort_order)`,
      [body.title || "Contact", body.description || "", JSON.stringify(media), Number(body.sort_order || 7)]
    );
    await pool.query(
      `INSERT INTO portfolio_profile (id, full_name, headline, bio, email, phone, location, map_embed_url)
       VALUES (1, 'Your Name', 'Full Stack Developer', '', NULL, NULL, ?, ?)
       ON DUPLICATE KEY UPDATE location = VALUES(location), map_embed_url = VALUES(map_embed_url)`,
      [body.location || null, body.map_embed_url || null]
    );
    return;
  }

  await pool.query(
    `INSERT INTO site_sections (section_key, title, description, media, sort_order)
     VALUES (?, ?, ?, CAST(? AS JSON), ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), media = VALUES(media), sort_order = VALUES(sort_order)`,
    [body.type, body.title || body.type, body.description || "", JSON.stringify(media), Number(body.sort_order || 0)]
  );
}
