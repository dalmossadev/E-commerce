import { NextResponse } from 'next/server';

export async function POST() {
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = [
    '__session=',
    'Path=/',
    'HttpOnly',
    isProduction ? 'Secure' : '',
    'SameSite=Lax',
    'Max-Age=0',
  ]
    .filter(Boolean)
    .join('; ');

  const nextResponse = NextResponse.json({ success: true });
  nextResponse.headers.append('Set-Cookie', cookieOptions);

  return nextResponse;
}