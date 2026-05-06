import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const url = `${API_BASE_URL}/api/v1/suppliers/${params.id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Backend error: ${response.status}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch supplier' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const url = `${API_BASE_URL}/api/v1/suppliers/${params.id}`;

  try {
    const body = await request.json();
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to update supplier' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const url = `${API_BASE_URL}/api/v1/suppliers/${params.id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error(`Backend error: ${response.status}`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete supplier' },
      { status: 500 }
    );
  }
}
