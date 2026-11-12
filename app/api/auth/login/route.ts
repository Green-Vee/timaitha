import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const adminUser = process.env.ADMIN_USERNAME || "alique";
    const adminPass = process.env.ADMIN_PASSWORD || "securepassword";

    if (username === adminUser && password === adminPass) {
      const response = NextResponse.json({ success: true }, { status: 200 });

      // Set the cookie directly on the response cookies
      response.cookies.set({
        name: "timaitha_session",
        value: "timaitha_session_token_verified",
        httpOnly: true,
        secure: false, // MUST be false on localhost HTTP
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid username or password." },
      { status: 401 },
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during authentication." },
      { status: 500 },
    );
  }
}
