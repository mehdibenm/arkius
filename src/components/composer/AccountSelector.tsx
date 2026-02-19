'use client';

import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { SocialNetwork } from '@/types';

const PLATFORM_ICONS: Record<SocialNetwork, React.ReactNode> = {
  instagram: <Instagram size={16} />,
  facebook: <Facebook size={16} />,
  linkedin: <Linkedin size={16} />,
  tiktok: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.8.1v-3.5a6.37 6.37 0 00-.8-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.68a8.22 8.22 0 003.76.92V6.15a4.85 4.85 0 01-.01.54z" />
    </svg>
  ),
};

const PLATFORM_COLORS: Record<SocialNetwork, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  tiktok: '#000000',
};

export default function AccountSelector() {
  const { accounts, selectedAccounts, toggleAccount } = useAppStore();

  const groupedAccounts = accounts.reduce(
    (acc, account) => {
      if (!acc[account.platform]) acc[account.platform] = [];
      acc[account.platform].push(account);
      return acc;
    },
    {} as Record<string, typeof accounts>
  );

  const platformOrder: SocialNetwork[] = ['instagram', 'facebook', 'linkedin', 'tiktok'];

  if (accounts.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-center">
        <p className="text-[13px] text-[var(--text-secondary)]">
          No accounts connected. Go to Accounts to add social media accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-[13px] font-medium text-[var(--text-secondary)]">
        Select Accounts
      </label>

      <div className="space-y-3">
        {platformOrder.map((platform) => {
          const platformAccounts = groupedAccounts[platform];
          if (!platformAccounts || platformAccounts.length === 0) return null;

          return (
            <div key={platform}>
              <div className="flex items-center gap-2 mb-1.5">
                <span style={{ color: PLATFORM_COLORS[platform] }}>
                  {PLATFORM_ICONS[platform]}
                </span>
                <span className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  {platform}
                </span>
              </div>
              <div className="space-y-1">
                {platformAccounts.map((account) => {
                  const isSelected = selectedAccounts.includes(account.id);
                  return (
                    <button
                      key={account.id}
                      onClick={() => toggleAccount(account.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                        isSelected
                          ? 'bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)]/30'
                          : 'bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border)]'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                        style={{ backgroundColor: PLATFORM_COLORS[platform] }}
                      >
                        {account.accountName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                          {account.accountName}
                        </p>
                      </div>
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-[var(--accent)] border-[var(--accent)]'
                            : 'border-[var(--border)]'
                        }`}
                      >
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
