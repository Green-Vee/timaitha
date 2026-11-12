import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("timaitha_session");

  const isAuthenticated = session?.value === "timaitha_session_token_verified";

  return NextResponse.json({ isAuthenticated }, { status: 200 });
}
