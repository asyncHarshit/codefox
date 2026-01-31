import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const event = request.headers.get("x-github-event");
  console.log("EVENT:", event);

  // 🔑 Handle ping FIRST
  if (event === "ping") {
    return NextResponse.json({ message: "pong" });
  }

  // Only parse JSON for real events
  const body = await request.json();
  console.log("PR ACTION:", body.action);

  return NextResponse.json({ ok: true });
}
