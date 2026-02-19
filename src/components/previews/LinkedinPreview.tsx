'use client';

import { ThumbsUp, MessageCircle, Repeat, Send, Globe } from 'lucide-react';

interface Props {
  text: string;
  mediaUrls: string[];
}

export default function LinkedinPreview({ text, mediaUrls }: Props) {
  return (
    <div className="w-[400px] bg-white rounded-xl border border-[var(--border-light)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-lg">
          U
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#000000E6]">User Name</p>
          <p className="text-[12px] text-[#00000099]">Title or Description</p>
          <div className="flex items-center gap-1 text-[12px] text-[#00000099]">
            <span>Just now</span>
            <span>-</span>
            <Globe size={10} />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="px-3 pb-2">
        <p className="text-[14px] text-[#000000E6] leading-[20px] whitespace-pre-wrap">
          {text || 'Your LinkedIn post text will appear here...'}
        </p>
      </div>

      {/* Media */}
      {mediaUrls.length > 0 && (
        <div className="aspect-[1.91/1] bg-gray-100 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrls[0]}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Reactions */}
      <div className="px-3 py-2 flex items-center justify-between text-[12px] text-[#00000099] border-b border-gray-100">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-[#0A66C2] border border-white" />
            <div className="w-4 h-4 rounded-full bg-red-500 border border-white" />
          </div>
          <span>0</span>
        </div>
        <span>0 comments - 0 reposts</span>
      </div>

      {/* Actions */}
      <div className="flex">
        {[
          { icon: <ThumbsUp size={18} />, label: 'Like' },
          { icon: <MessageCircle size={18} />, label: 'Comment' },
          { icon: <Repeat size={18} />, label: 'Repost' },
          { icon: <Send size={18} />, label: 'Send' },
        ].map((action) => (
          <button
            key={action.label}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-medium text-[#00000099] hover:bg-gray-50 transition-colors"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
