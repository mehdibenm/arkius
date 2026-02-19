'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/lib/store';
import { getUserSocialAccounts } from '@/lib/firestore';
import AppLayout from '@/components/layout/AppLayout';
import TextEditor from '@/components/composer/TextEditor';
import MediaUploader from '@/components/composer/MediaUploader';
import AccountSelector from '@/components/composer/AccountSelector';
import PublishActions from '@/components/composer/PublishActions';
import PreviewPanel from '@/components/previews/PreviewPanel';

export default function ComposePage() {
  const { user } = useAuth();
  const { setAccounts } = useAppStore();

  useEffect(() => {
    if (user) {
      getUserSocialAccounts(user.uid).then(setAccounts).catch(console.error);
    }
  }, [user, setAccounts]);

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)]">
          Create Post
        </h2>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">
          Compose and publish to multiple social networks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Editor */}
        <div className="space-y-6">
          <div className="apple-card p-6">
            <TextEditor />
          </div>

          <div className="apple-card p-6">
            <MediaUploader />
          </div>

          <div className="apple-card p-6">
            <AccountSelector />
          </div>

          <PublishActions />
        </div>

        {/* Right column - Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <PreviewPanel />
        </div>
      </div>
    </AppLayout>
  );
}
