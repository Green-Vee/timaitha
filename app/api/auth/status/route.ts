import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('timaitha_session');

    // Check if the cookie exists and has a valid value
    const isAuthenticated = Boolean(session && session.value);

    return NextResponse.json({ isAuthenticated }, { status: 200 });
  } catch (err) {
    console.error("Auth status error:", err);
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}