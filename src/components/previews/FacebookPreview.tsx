'use client';

import { ThumbsUp, MessageCircle, Share2, Globe } from 'lucide-react';

interface Props {
  text: string;
  mediaUrls: string[];
}

export default function FacebookPreview({ text, mediaUrls }: Props) {
  return (
    <div className="w-[400px] bg-white rounded-xl border border-[var(--border-light)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold text-sm">
          U
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#050505]">Page Name</p>
          <div className="flex items-center gap-1 text-[12px] text-[#65676B]">
            <span>Just now</span>
            <span>-</span>
            <Globe size={10} />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="px-3 pb-2">
        <p className="text-[14px] text-[#050505] leading-[20px] whitespace-pre-wrap">
          {text || 'Your post text will appear here...'}
        </p>
      </div>

      {/* Media */}
      {mediaUrls.length > 0 && (
        <div className="aspect-video bg-gray-100 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrls[0]}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Reactions bar */}
      <div className="px-3 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-[13px] text-[#65676B]">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center">
              <ThumbsUp size={10} className="text-white" />
            </div>
            <span>0</span>
          </div>
          <span>0 comments</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex border-t border-gray-200">
        {[
          { icon: <ThumbsUp size={18} />, label: 'Like' },
          { icon: <MessageCircle size={18} />, label: 'Comment' },
          { icon: <Share2 size={18} />, label: 'Share' },
        ].map((action) => (
          <button
            key={action.label}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium text-[#65676B] hover:bg-gray-50 transition-colors"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
