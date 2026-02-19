'use client';

import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { SocialNetwork } from '@/types';
import InstagramPreview from './InstagramPreview';
import FacebookPreview from './FacebookPreview';
import LinkedinPreview from './LinkedinPreview';
import TiktokPreview from './TiktokPreview';

const tabs: { platform: SocialNetwork; label: string; icon: React.ReactNode; color: string }[] = [
  { platform: 'instagram', label: 'Instagram', icon: <Instagram size={14} />, color: '#E4405F' },
  { platform: 'facebook', label: 'Facebook', icon: <Facebook size={14} />, color: '#1877F2' },
  { platform: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={14} />, color: '#0A66C2' },
  {
    platform: 'tiktok',
    label: 'TikTok',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.8.1v-3.5a6.37 6.37 0 00-.8-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.68a8.22 8.22 0 003.76.92V6.15a4.85 4.85 0 01-.01.54z" />
      </svg>
    ),
    color: '#000000',
  },
];

export default function PreviewPanel() {
  const { previewPlatform, setPreviewPlatform, composerText, composerTextLinkedin, useLinkedinSeparateText, composerMedia } = useAppStore();

  const mediaUrls = composerMedia.map((f) => URL.createObjectURL(f));
  const text = previewPlatform === 'linkedin' && useLinkedinSeparateText && composerTextLinkedin
    ? composerTextLinkedin
    : composerText;

  return (
    <div className="apple-card">
      {/* Platform tabs */}
      <div className="flex border-b border-[var(--border-light)]">
        {tabs.map((tab) => (
          <button
            key={tab.platform}
            onClick={() => setPreviewPlatform(tab.platform)}
            className={`flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium transition-colors border-b-2 ${
              previewPlatform === tab.platform
                ? `border-current`
                : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
            style={
              previewPlatform === tab.platform ? { color: tab.color } : undefined
            }
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Preview content */}
      <div className="p-6">
        <h3 className="text-[13px] font-medium text-[var(--text-secondary)] mb-4">
          Preview
        </h3>
        <div className="flex justify-center">
          {previewPlatform === 'instagram' && (
            <InstagramPreview text={text} mediaUrls={mediaUrls} />
          )}
          {previewPlatform === 'facebook' && (
            <FacebookPreview text={text} mediaUrls={mediaUrls} />
          )}
          {previewPlatform === 'linkedin' && (
            <LinkedinPreview text={text} mediaUrls={mediaUrls} />
          )}
          {previewPlatform === 'tiktok' && (
            <TiktokPreview text={text} mediaUrls={mediaUrls} />
          )}
        </div>
      </div>
    </div>
  );
}
