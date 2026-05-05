import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Pegar o cookie de autenticação (__session)
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('__session');

    const headers = new Headers();
    if (sessionCookie) {
      headers.set('cookie', `${sessionCookie.name}=${sessionCookie.value}`);
    }

    const response = await fetch(`${apiUrl}/api/v1/financial/dashboard`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Financial Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
