import { NextResponse } from "next/server";
import { getAllPortfolioContent, createPortfolioContent, upsertSingleton, getDatabaseStatus } from "@/lib/db";

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
  const dbStatus = getDatabaseStatus();

  return new NextResponse(
    JSON.stringify(type ? content.filter((item) => item.type === type) : content),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Database-Status": dbStatus
      }
    }
  );
}

export async function POST(request) {
  if (!isAllowed(request)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const body = await request.json();
  const dbStatus = getDatabaseStatus();

  try {
    if (["project", "certificate", "course", "education"].includes(body.type)) {
      const genericItem = await createPortfolioContent(body.type, body);
      return new NextResponse(JSON.stringify(genericItem), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "X-Database-Status": dbStatus
        }
      });
    }

    if (["intro", "about", "contact"].includes(body.type)) {
      await upsertSingleton(body.type, body);
      const content = await getAllPortfolioContent();
      const singletonItem = content.find((item) => item.type === body.type);
      return new NextResponse(JSON.stringify(singletonItem), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "X-Database-Status": dbStatus
        }
      });
    }

    return NextResponse.json({ error: "Unsupported content type." }, { status: 400 });
  } catch (err) {
    console.error("POST content operation failed:", err);
    return NextResponse.json({ error: err.message || "Failed to create content." }, { status: 500 });
  }
}
