import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

function isAllowed(request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return true;
  return request.headers.get("x-admin-password") === password;
}

function safeName(name) {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, ext).replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  return `${base}-${Date.now()}${ext}`;
}

export async function POST(request) {
  if (!isAllowed(request)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((file) => file?.name);
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const uploaded = [];
  for (const file of files) {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      continue;
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = safeName(file.name);
    await writeFile(path.join(uploadDir, filename), bytes);
    uploaded.push({
      url: `/uploads/${filename}`,
      type: file.type,
      name: file.name
    });
  }

  return NextResponse.json(uploaded);
}
