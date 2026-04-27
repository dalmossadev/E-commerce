import { NextRequest, NextResponse } from 'next/server';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get('cookie');
    const sessionToken = cookie?.match(/__session=([^;]+)/)?.[1];

    if (!sessionToken) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const user: User = await response.json();
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}