'use client';

import { useRef, useEffect } from 'react';
import { Linkedin } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { PLATFORM_LIMITS } from '@/types';

export default function TextEditor() {
  const {
    composerText,
    setComposerText,
    composerTextLinkedin,
    setComposerTextLinkedin,
    useLinkedinSeparateText,
    setUseLinkedinSeparateText,
    selectedAccounts,
    accounts,
  } = useAppStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const linkedinTextareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedPlatforms = [...new Set(
    accounts
      .filter((a) => selectedAccounts.includes(a.id))
      .map((a) => a.platform)
  )];

  const hasLinkedin = selectedPlatforms.includes('linkedin');
  const hasOther = selectedPlatforms.some((p) => p !== 'linkedin');

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  useEffect(() => {
    autoResize(textareaRef.current);
  }, [composerText]);

  useEffect(() => {
    autoResize(linkedinTextareaRef.current);
  }, [composerTextLinkedin]);

  const getCharLimit = () => {
    const platforms = useLinkedinSeparateText
      ? selectedPlatforms.filter((p) => p !== 'linkedin')
      : selectedPlatforms;
    if (platforms.length === 0) return 63206;
    return Math.min(...platforms.map((p) => PLATFORM_LIMITS[p].maxTextLength));
  };

  const charLimit = getCharLimit();
  const isOverLimit = composerText.length > charLimit;

  return (
    <div className="space-y-4">
      {/* Main text */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] font-medium text-[var(--text-secondary)]">
            {useLinkedinSeparateText && hasOther
              ? 'Text for Instagram, Facebook & TikTok'
              : 'Publication Text'}
          </label>
          <span
            className={`text-[12px] ${
              isOverLimit ? 'text-[var(--danger)]' : 'text-[var(--text-tertiary)]'
            }`}
          >
            {composerText.length}/{charLimit}
          </span>
        </div>
        <textarea
          ref={textareaRef}
          className="apple-input min-h-[120px] resize-none"
          placeholder="Write your publication text..."
          value={composerText}
          onChange={(e) => setComposerText(e.target.value)}
        />
      </div>

      {/* LinkedIn separate toggle */}
      {hasLinkedin && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUseLinkedinSeparateText(!useLinkedinSeparateText)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              useLinkedinSeparateText ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                useLinkedinSeparateText ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <Linkedin size={14} className="text-[#0A66C2]" />
            <span className="text-[13px] text-[var(--text-secondary)]">
              Separate text for LinkedIn
            </span>
          </div>
        </div>
      )}

      {/* LinkedIn text */}
      {useLinkedinSeparateText && hasLinkedin && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[13px] font-medium text-[#0A66C2] flex items-center gap-1.5">
              <Linkedin size={14} />
              LinkedIn Text
            </label>
            <span
              className={`text-[12px] ${
                composerTextLinkedin.length > PLATFORM_LIMITS.linkedin.maxTextLength
                  ? 'text-[var(--danger)]'
                  : 'text-[var(--text-tertiary)]'
              }`}
            >
              {composerTextLinkedin.length}/{PLATFORM_LIMITS.linkedin.maxTextLength}
            </span>
          </div>
          <textarea
            ref={linkedinTextareaRef}
            className="apple-input min-h-[120px] resize-none border-[#0A66C2]/30 focus:border-[#0A66C2]"
            placeholder="Write your LinkedIn-specific text..."
            value={composerTextLinkedin}
            onChange={(e) => setComposerTextLinkedin(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
