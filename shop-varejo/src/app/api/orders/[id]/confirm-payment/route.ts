import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Copiar headers de autorização e cookies
    const headers = new Headers();
    const authHeader = request.headers.get('authorization');
    if (authHeader) headers.set('authorization', authHeader);
    
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) headers.set('cookie', cookieHeader);

    headers.set('Content-Type', 'application/json');
    
    const backendResponse = await fetch(`${apiUrl}/api/v1/orders/${id}/confirm-payment`, {
      method: 'PATCH',
      headers,
    });
    
    const data = await backendResponse.json().catch(() => ({}));
    
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error: any) {
    console.error('Error proxying PATCH confirm-payment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
