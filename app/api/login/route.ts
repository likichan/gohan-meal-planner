import { NextRequest, NextResponse } from 'next/server';

const PASSWORD = process.env.SITE_PASSWORD;
const COOKIE_NAME = 'gohan_auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!PASSWORD) {
    return NextResponse.json({ error: 'パスワードが設定されていません' }, { status: 500 });
  }

  if (password !== PASSWORD) {
    return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30日間
    path: '/',
  });

  return response;
}
