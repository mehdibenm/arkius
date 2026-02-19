'use client';

import { useEffect, useState } from 'react';
import {
  Instagram,
  Facebook,
  Linkedin,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/lib/store';
import {
  getUserSocialAccounts,
  addSocialAccount,
  removeSocialAccount,
} from '@/lib/firestore';
import AppLayout from '@/components/layout/AppLayout';
import type { SocialNetwork, SocialAccount } from '@/types';

const PLATFORMS: {
  id: SocialNetwork;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  description: string;
}[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    icon: <Instagram size={20} />,
    color: '#E4405F',
    bgLight: 'rgba(228, 64, 95, 0.08)',
    description: 'Photos, Reels, Stories',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: <Facebook size={20} />,
    color: '#1877F2',
    bgLight: 'rgba(24, 119, 242, 0.08)',
    description: 'Posts, Videos, Stories',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: <Linkedin size={20} />,
    color: '#0A66C2',
    bgLight: 'rgba(10, 102, 194, 0.08)',
    description: 'Articles, Posts, Documents',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.8.1v-3.5a6.37 6.37 0 00-.8-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.68a8.22 8.22 0 003.76.92V6.15a4.85 4.85 0 01-.01.54z" />
      </svg>
    ),
    color: '#000000',
    bgLight: 'rgba(0, 0, 0, 0.05)',
    description: 'Short Videos, Stories',
  },
];

export default function AccountsPage() {
  const { user } = useAuth();
  const { accounts, setAccounts, addAccount, removeAccount } = useAppStore();
  const [connecting, setConnecting] = useState<SocialNetwork | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountPlatform, setNewAccountPlatform] =
    useState<SocialNetwork>('instagram');

  useEffect(() => {
    if (user) {
      getUserSocialAccounts(user.uid).then(setAccounts).catch(console.error);
    }
  }, [user, setAccounts]);

  const handleConnect = async () => {
    if (!user || !newAccountName.trim()) return;
    setConnecting(newAccountPlatform);

    try {
      const account: SocialAccount = {
        id: uuidv4(),
        userId: user.uid,
        platform: newAccountPlatform,
        accountName: newAccountName.trim(),
        accountId: uuidv4(),
        accessToken: '',
        connected: true,
        connectedAt: new Date().toISOString(),
      };

      await addSocialAccount(account);
      addAccount(account);
      toast.success(`${newAccountName} connected via Componzio`);
      setShowAddModal(false);
      setNewAccountName('');
    } catch {
      toast.error('Failed to connect account. Please check your Componzio subscription.');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (account: SocialAccount) => {
    try {
      await removeSocialAccount(account.id);
      removeAccount(account.id);
      toast.success(`${account.accountName} disconnected`);
    } catch {
      toast.error('Failed to disconnect account');
    }
  };

  const getAccountsByPlatform = (platform: SocialNetwork) =>
    accounts.filter((a) => a.platform === platform);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[24px] font-semibold text-[var(--text-primary)]">
            Social Accounts
          </h2>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            Manage your connected accounts via Componzio
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="apple-btn apple-btn-primary"
        >
          <Plus size={16} /> Add Account
        </button>
      </div>

      {/* Info banner */}
      <div className="apple-card p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <ExternalLink size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-medium text-[var(--text-primary)]">
              Powered by Componzio
            </p>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              All social media connections are managed through Componzio, enabling direct publishing
              to multiple accounts simultaneously. Componzio requires an active subscription.
            </p>
          </div>
        </div>
      </div>

      {/* Platform sections */}
      <div className="space-y-6">
        {PLATFORMS.map((platform) => {
          const platformAccounts = getAccountsByPlatform(platform.id);

          return (
            <div key={platform.id} className="apple-card">
              <div
                className="p-4 flex items-center justify-between border-b border-[var(--border-light)]"
                style={{ background: platform.bgLight }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: platform.color }}
                  >
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                      {platform.label}
                    </h3>
                    <p className="text-[12px] text-[var(--text-secondary)]">
                      {platform.description}
                    </p>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  {platformAccounts.length} account{platformAccounts.length !== 1 ? 's' : ''}
                </span>
              </div>

              {platformAccounts.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-[13px] text-[var(--text-tertiary)]">
                    No {platform.label} accounts connected
                  </p>
                  <button
                    onClick={() => {
                      setNewAccountPlatform(platform.id);
                      setShowAddModal(true);
                    }}
                    className="apple-btn apple-btn-ghost text-[13px] mt-2"
                  >
                    <Plus size={14} /> Connect {platform.label}
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-light)]">
                  {platformAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center gap-4 p-4 hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: platform.color }}
                      >
                        {account.accountName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-[var(--text-primary)]">
                          {account.accountName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {account.connected ? (
                            <>
                              <CheckCircle size={12} className="text-[var(--success)]" />
                              <span className="text-[11px] text-[var(--success)]">Connected</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={12} className="text-[var(--danger)]" />
                              <span className="text-[11px] text-[var(--danger)]">Disconnected</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDisconnect(account)}
                          className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors"
                          title="Disconnect"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="apple-card w-full max-w-[420px] p-6 fade-in">
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-4">
              Connect Account
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
                  Platform
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setNewAccountPlatform(p.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                        newAccountPlatform === p.id
                          ? 'border-[var(--accent)] bg-blue-50'
                          : 'border-[var(--border-light)] hover:border-[var(--border)]'
                      }`}
                    >
                      <span style={{ color: p.color }}>{p.icon}</span>
                      <span className="text-[13px] font-medium">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
                  Account Name
                </label>
                <input
                  type="text"
                  className="apple-input"
                  placeholder="e.g., My Business Page"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                />
              </div>

              <p className="text-[12px] text-[var(--text-tertiary)]">
                You will be redirected to Componzio to authorize this account connection.
                An active Componzio subscription is required.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewAccountName('');
                  }}
                  className="apple-btn apple-btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!newAccountName.trim() || connecting !== null}
                  className="apple-btn apple-btn-primary flex-1"
                >
                  {connecting ? (
                    <span className="spinner" />
                  ) : (
                    <>
                      <RefreshCw size={14} /> Connect
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
