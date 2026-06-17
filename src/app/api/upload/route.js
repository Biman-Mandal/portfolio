import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

function isAllowed(request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return true;
  return request.headers.get("x-admin-password") === password;
}

function safeName(name) {
  const rawName = String(name || "upload");
  const lastSegment = rawName.split(/[/\\]/).pop() || "upload";
  const parts = lastSegment.split(".");
  const ext = parts.length > 1 ? `.${parts.pop().toLowerCase()}` : "";
  const base = parts.join(".").replace(/[^a-z0-9-]/gi, "-").toLowerCase() || "upload";
  return `${base}-${Date.now()}${ext}`;
}

export async function POST(request) {
  if (!isAllowed(request)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const files = form.getAll("files").filter((file) => file?.name);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const uploaded = [];
    for (const file of files) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        continue;
      }

      const filename = safeName(file.name);
      const filePath = path.join(uploadDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      uploaded.push({
        url: `/uploads/${filename}`,
        type: file.type,
        name: file.name
      });
    }

    return NextResponse.json(uploaded);
  } catch (error) {
    console.error("Local upload failed:", error);
    return NextResponse.json({ error: "Failed to upload file locally." }, { status: 500 });
  }
}
