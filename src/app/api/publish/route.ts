import { NextRequest, NextResponse } from 'next/server';

const COMPONZIO_API_URL = process.env.COMPONZIO_API_URL || 'https://api.componzio.com/v1';
const COMPONZIO_API_KEY = process.env.COMPONZIO_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accounts, text, textLinkedin, mediaUrls, scheduledAt } = body;

    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      return NextResponse.json(
        { error: 'At least one account is required' },
        { status: 400 }
      );
    }

    const results = await Promise.allSettled(
      accounts.map(async (account: { accountId: string; platform: string }) => {
        const contentText =
          account.platform === 'linkedin' && textLinkedin
            ? textLinkedin
            : text;

        const res = await fetch(`${COMPONZIO_API_URL}/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${COMPONZIO_API_KEY}`,
          },
          body: JSON.stringify({
            accountId: account.accountId,
            platform: account.platform,
            content: {
              text: contentText,
              mediaUrls: mediaUrls || [],
            },
            scheduledAt,
          }),
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(error.message || `Failed for ${account.platform}`);
        }

        return res.json();
      })
    );

    const response = results.map((result, index) => ({
      account: accounts[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : undefined,
      error: result.status === 'rejected' ? result.reason?.message : undefined,
    }));

    return NextResponse.json({ results: response });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
