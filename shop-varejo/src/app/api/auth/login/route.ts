import { NextRequest, NextResponse } from 'next/server';

interface LoginDTO {
  email: string;
  password: string;
}

interface AuthResponseDTO {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginDTO = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Credenciais inválidas' },
        { status: response.status }
      );
    }

    const authResponse = data as AuthResponseDTO;

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = [
      `__session=${authResponse.accessToken}`,
      `Path=/`,
      `HttpOnly`,
      isProduction ? 'Secure' : '',
      'SameSite=Lax',
      `Max-Age=900`,
    ]
      .filter(Boolean)
      .join('; ');

    const nextResponse = NextResponse.json({
      user: authResponse.user,
    });

    nextResponse.headers.append('Set-Cookie', cookieOptions);

    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}