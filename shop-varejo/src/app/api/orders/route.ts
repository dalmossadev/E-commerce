import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  const cookie = request.headers.get('cookie');
  const sessionToken = cookie?.match(/__session=([^;]+)/)?.[1];

  if (!sessionToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/api/v1/orders${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Sessão expirada' }, { status: 401 });
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar pedidos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Itens do pedido são obrigatórios' },
        { status: 400 }
      );
    }

    const cookie = request.headers.get('cookie');
    const sessionToken = cookie?.match(/__session=([^;]+)/)?.[1];

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }

    // Log diagnóstico detalhado de tipos
    console.log('[/api/orders POST] payload enviado ao backend:');
    if (body.items && Array.isArray(body.items)) {
      body.items.forEach((item: any, idx: number) => {
        console.log(`  - Item[${idx}]: variantId=${item.variantId} (${typeof item.variantId}), sku=${item.sku}`);
      });
    }
    console.log('Full body:', JSON.stringify(body, null, 2));

    const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Log diagnóstico — remover após validação
    console.log('[/api/orders POST] resposta do backend:', response.status, JSON.stringify(data));

    if (!response.ok) {
      // Repassar erros de validação do backend diretamente (status + errors[])
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
