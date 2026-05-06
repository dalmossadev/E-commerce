import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  const url = `${API_BASE_URL}/api/v1/addresses/customer/${params.customerId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Backend error: ${response.status}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch customer addresses' },
      { status: 500 }
    );
  }
}
