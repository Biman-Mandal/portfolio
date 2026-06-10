import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

function getStorageClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request) {
  if (!isAllowed(request)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((file) => file?.name);
  const storage = getStorageClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

  if (!storage) {
    return NextResponse.json(
      {
        error: "File uploads require Supabase Storage on Cloudflare. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET."
      },
      { status: 501 }
    );
  }

  const uploaded = [];
  for (const file of files) {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      continue;
    }

    const filename = safeName(file.name);
    const { error } = await storage.storage.from(bucket).upload(filename, file, {
      contentType: file.type,
      upsert: true
    });

    if (error) {
      console.error("Upload failed:", error);
      return NextResponse.json({ error: error.message || "Failed to upload file." }, { status: 500 });
    }

    const { data } = storage.storage.from(bucket).getPublicUrl(filename);
    uploaded.push({
      url: data.publicUrl,
      type: file.type,
      name: file.name
    });
  }

  return NextResponse.json(uploaded);
}
