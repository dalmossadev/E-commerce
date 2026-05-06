import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookie = request.headers.get('cookie');
  const sessionToken = cookie?.match(/__session=([^;]+)/)?.[1];

  if (!sessionToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    return NextResponse.json(
      { error: 'Falha ao atualizar status do pedido' },
      { status: 500 }
    );
  }
}
