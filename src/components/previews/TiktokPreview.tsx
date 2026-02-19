'use client';

import { Heart, MessageCircle, Share2, Music } from 'lucide-react';

interface Props {
  text: string;
  mediaUrls: string[];
}

export default function TiktokPreview({ text, mediaUrls }: Props) {
  return (
    <div className="w-[280px] bg-black rounded-xl overflow-hidden relative" style={{ height: 500 }}>
      {/* Media / Background */}
      <div className="absolute inset-0">
        {mediaUrls.length > 0 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={mediaUrls[0]}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-[13px]">
            No media added
          </div>
        )}
      </div>

      {/* Right side actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
        {/* Profile */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-600 border-2 border-white" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FE2C55] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">+</span>
          </div>
        </div>

        {[
          { icon: <Heart size={26} />, count: '0' },
          { icon: <MessageCircle size={26} />, count: '0' },
          { icon: <Share2 size={26} />, count: '0' },
        ].map((action, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-white">{action.icon}</span>
            <span className="text-white text-[11px]">{action.count}</span>
          </div>
        ))}

        {/* Music disc */}
        <div className="w-10 h-10 rounded-full bg-gray-800 border-4 border-gray-600 animate-[spin_3s_linear_infinite]">
          <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-4 left-3 right-16">
        <p className="text-white text-[14px] font-semibold mb-1">@username</p>
        <p className="text-white text-[13px] leading-[17px] line-clamp-3">
          {text || 'Your caption will appear here...'}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <Music size={12} className="text-white" />
          <span className="text-white text-[12px]">Original sound - username</span>
        </div>
      </div>
    </div>
  );
}
