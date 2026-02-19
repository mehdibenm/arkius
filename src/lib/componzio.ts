import type { SocialNetwork, SocialAccount } from '@/types';

const COMPONZIO_API_URL = process.env.COMPONZIO_API_URL || 'https://api.componzio.com/v1';
const COMPONZIO_API_KEY = process.env.COMPONZIO_API_KEY || '';

interface ComponzioPublishRequest {
  accountId: string;
  platform: SocialNetwork;
  content: {
    text: string;
    mediaUrls: string[];
  };
  scheduledAt?: string;
}

interface ComponzioPublishResponse {
  id: string;
  status: 'published' | 'scheduled' | 'failed';
  publishedUrl?: string;
  error?: string;
}

interface ComponzioConnectResponse {
  accountId: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  profileImageURL?: string;
}

async function componzioFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${COMPONZIO_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${COMPONZIO_API_KEY}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Componzio API error: ${res.status}`);
  }

  return res.json();
}

export async function connectAccount(
  platform: SocialNetwork,
  authCode: string
): Promise<ComponzioConnectResponse> {
  return componzioFetch<ComponzioConnectResponse>('/accounts/connect', {
    method: 'POST',
    body: JSON.stringify({ platform, authCode }),
  });
}

export async function disconnectAccount(accountId: string): Promise<void> {
  await componzioFetch(`/accounts/${accountId}/disconnect`, {
    method: 'POST',
  });
}

export async function publishToAccount(
  request: ComponzioPublishRequest
): Promise<ComponzioPublishResponse> {
  return componzioFetch<ComponzioPublishResponse>('/publish', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function publishToMultipleAccounts(
  accounts: SocialAccount[],
  text: string,
  textLinkedin: string | undefined,
  mediaUrls: string[],
  scheduledAt?: string
): Promise<ComponzioPublishResponse[]> {
  const requests = accounts.map((account) => {
    const contentText =
      account.platform === 'linkedin' && textLinkedin ? textLinkedin : text;

    return publishToAccount({
      accountId: account.accountId,
      platform: account.platform,
      content: {
        text: contentText,
        mediaUrls,
      },
      scheduledAt,
    });
  });

  return Promise.allSettled(requests).then((results) =>
    results.map((r) =>
      r.status === 'fulfilled'
        ? r.value
        : { id: '', status: 'failed' as const, error: r.reason?.message }
    )
  );
}

export async function getComponzioAuthUrl(platform: SocialNetwork): Promise<string> {
  const res = await componzioFetch<{ url: string }>(`/accounts/auth-url?platform=${platform}`);
  return res.url;
}
