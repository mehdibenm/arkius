'use client';

import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

interface Props {
  text: string;
  mediaUrls: string[];
}

export default function InstagramPreview({ text, mediaUrls }: Props) {
  return (
    <div className="w-[340px] bg-white rounded-xl border border-[var(--border-light)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[2px]">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gray-200" />
          </div>
        </div>
        <span className="text-[13px] font-semibold text-[#262626]">username</span>
      </div>

      {/* Media */}
      <div className="aspect-square bg-gray-100 relative">
        {mediaUrls.length > 0 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={mediaUrls[0]}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)] text-[13px]">
            No media added
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Heart size={22} className="text-[#262626]" />
            <MessageCircle size={22} className="text-[#262626]" />
            <Send size={22} className="text-[#262626]" />
          </div>
          <Bookmark size={22} className="text-[#262626]" />
        </div>
        <p className="text-[13px] text-[#262626] leading-[18px]">
          <span className="font-semibold">username </span>
          {text || 'Your caption will appear here...'}
        </p>
      </div>
    </div>
  );
}
