import { NextResponse } from "next/server";
import { getAllPortfolioContent, getPool, parseGenericId, toGeneric } from "@/lib/db";

export const dynamic = "force-dynamic";

function isAllowed(request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return true;
  return request.headers.get("x-admin-password") === password;
}

export async function PUT(request, { params }) {
  if (!isAllowed(request)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const body = await request.json();
  const { id: genericId } = await params;
  const { type, id } = parseGenericId(genericId);
  const pool = getPool();
  const media = Array.isArray(body.media) ? body.media : [];
  let rows;

  if (type === "project") {
    await pool.query(
      `UPDATE projects SET title = ?, description = ?, live_url = ?, media = CAST(? AS JSON), sort_order = ? WHERE id = ?`,
      [body.title || "Untitled Project", body.description || "", body.link || null, JSON.stringify(media), Number(body.sort_order || 0), id]
    );
    [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);
    return NextResponse.json(toGeneric("project", rows[0]));
  }

  if (type === "certificate") {
    await pool.query(
      `UPDATE certificates SET title = ?, description = ?, credential_url = ?, media = CAST(? AS JSON), sort_order = ? WHERE id = ?`,
      [body.title || "Untitled Certificate", body.description || "", body.link || null, JSON.stringify(media), Number(body.sort_order || 0), id]
    );
    [rows] = await pool.query("SELECT * FROM certificates WHERE id = ?", [id]);
    return NextResponse.json(toGeneric("certificate", rows[0]));
  }

  if (type === "course") {
    await pool.query(
      `UPDATE courses SET title = ?, description = ?, link = ?, media = CAST(? AS JSON), sort_order = ? WHERE id = ?`,
      [body.title || "Untitled Course", body.description || "", body.link || null, JSON.stringify(media), Number(body.sort_order || 0), id]
    );
    [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);
    return NextResponse.json(toGeneric("course", rows[0]));
  }

  if (type === "education") {
    await pool.query(
      `UPDATE education SET institution = ?, description = ?, link = ?, media = CAST(? AS JSON), sort_order = ? WHERE id = ?`,
      [body.title || "Untitled Education", body.description || "", body.link || null, JSON.stringify(media), Number(body.sort_order || 0), id]
    );
    [rows] = await pool.query("SELECT * FROM education WHERE id = ?", [id]);
    return NextResponse.json(toGeneric("education", rows[0]));
  }

  if (["intro", "about", "contact"].includes(type)) {
    await upsertSingleton(pool, { ...body, type }, media);
    const content = await getAllPortfolioContent();
    return NextResponse.json(content.find((item) => item.type === type));
  }

  return NextResponse.json({ error: "Unsupported content type." }, { status: 400 });
}

export async function DELETE(request, { params }) {
  if (!isAllowed(request)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const { id: genericId } = await params;
  const { type, id } = parseGenericId(genericId);
  const tableByType = {
    project: "projects",
    certificate: "certificates",
    course: "courses",
    education: "education"
  };

  if (!tableByType[type]) {
    return NextResponse.json({ error: "This section cannot be deleted." }, { status: 400 });
  }

  await getPool().query(`DELETE FROM ${tableByType[type]} WHERE id = ?`, [id]);
  return NextResponse.json({ ok: true });
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
      `UPDATE portfolio_profile SET location = ?, map_embed_url = ? WHERE id = 1`,
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
