import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Copiar os headers de autorização se existirem
    const headers = new Headers();
    const authHeader = request.headers.get('authorization');
    if (authHeader) headers.set('authorization', authHeader);
    
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) headers.set('cookie', cookieHeader);
    
    const backendResponse = await fetch(`${apiUrl}/api/v1/orders/${id}`, {
      method: 'GET',
      headers,
    });
    
    const data = await backendResponse.json();
    
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error: any) {
    console.error('Error proxying GET order by id:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
