import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookie = request.headers.get('cookie');
  const sessionToken = cookie?.match(/__session=([^;]+)/)?.[1];

  if (!sessionToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const orderId = params.id;
  const url = `${API_BASE_URL}/api/v1/orders/${orderId}/pix`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Order PIX fetch error:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar dados do PIX' },
      { status: 500 }
    );
  }
}
