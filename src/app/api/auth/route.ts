import { NextRequest, NextResponse } from 'next/server';

const COMPONZIO_API_URL = process.env.COMPONZIO_API_URL || 'https://api.componzio.com/v1';
const COMPONZIO_API_KEY = process.env.COMPONZIO_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { platform, action } = await request.json();

    if (action === 'get-auth-url') {
      const res = await fetch(
        `${COMPONZIO_API_URL}/accounts/auth-url?platform=${platform}`,
        {
          headers: {
            Authorization: `Bearer ${COMPONZIO_API_KEY}`,
          },
        }
      );

      if (!res.ok) {
        return NextResponse.json(
          { error: 'Failed to get auth URL' },
          { status: 500 }
        );
      }

      const data = await res.json();
      return NextResponse.json(data);
    }

    if (action === 'connect') {
      const { authCode } = await request.json();
      const res = await fetch(`${COMPONZIO_API_URL}/accounts/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${COMPONZIO_API_KEY}`,
        },
        body: JSON.stringify({ platform, authCode }),
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: 'Failed to connect account' },
          { status: 500 }
        );
      }

      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
