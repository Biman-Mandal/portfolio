import { NextResponse } from "next/server";
import {
  getAllPortfolioContent,
  updatePortfolioContent,
  deletePortfolioContent,
  upsertSingleton,
  parseGenericId,
  getDatabaseStatus
} from "@/lib/db";

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
  const dbStatus = getDatabaseStatus();

  try {
    if (["project", "certificate", "course", "education"].includes(type)) {
      const updatedItem = await updatePortfolioContent(type, id, body);
      return new NextResponse(JSON.stringify(updatedItem), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Database-Status": dbStatus
        }
      });
    }

    if (["intro", "about", "contact"].includes(type)) {
      await upsertSingleton(type, body);
      const content = await getAllPortfolioContent();
      const singletonItem = content.find((item) => item.type === type);
      return new NextResponse(JSON.stringify(singletonItem), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Database-Status": dbStatus
        }
      });
    }

    return NextResponse.json({ error: "Unsupported content type." }, { status: 400 });
  } catch (err) {
    console.error("PUT content operation failed:", err);
    return NextResponse.json({ error: err.message || "Failed to update content." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!isAllowed(request)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const { id: genericId } = await params;
  const { type, id } = parseGenericId(genericId);
  const dbStatus = getDatabaseStatus();

  try {
    await deletePortfolioContent(type, id);
    return new NextResponse(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Database-Status": dbStatus
      }
    });
  } catch (err) {
    console.error("DELETE content operation failed:", err);
    return NextResponse.json({ error: err.message || "Failed to delete content." }, { status: 500 });
  }
}
