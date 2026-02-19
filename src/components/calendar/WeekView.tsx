'use client';

import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
} from 'date-fns';
import { useAppStore } from '@/lib/store';
import type { Publication, SocialNetwork } from '@/types';

const PLATFORM_COLORS: Record<SocialNetwork, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  tiktok: '#000000',
};

const PLATFORM_LABELS: Record<SocialNetwork, string> = {
  instagram: 'IG',
  facebook: 'FB',
  linkedin: 'LN',
  tiktok: 'TT',
};

export default function WeekView() {
  const { selectedDate, publications } = useAppStore();

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getPublicationsForDay = (day: Date): Publication[] => {
    return publications.filter((pub) => {
      const pubDate = pub.scheduledAt
        ? new Date(pub.scheduledAt)
        : new Date(pub.createdAt);
      return isSameDay(pubDate, day);
    });
  };

  return (
    <div className="apple-card">
      <div className="grid grid-cols-7 divide-x divide-[var(--border-light)]">
        {days.map((day) => {
          const dayPubs = getPublicationsForDay(day);
          const today = isToday(day);

          return (
            <div key={day.toISOString()} className="min-h-[500px]">
              {/* Day header */}
              <div
                className={`p-3 text-center border-b border-[var(--border-light)] ${
                  today ? 'bg-[rgba(0,113,227,0.05)]' : ''
                }`}
              >
                <div className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase">
                  {format(day, 'EEE')}
                </div>
                <div
                  className={`text-[20px] font-semibold mt-0.5 ${
                    today ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
                  }`}
                >
                  {format(day, 'd')}
                </div>
              </div>

              {/* Publications */}
              <div className="p-2 space-y-2">
                {dayPubs.map((pub) => (
                  <div
                    key={pub.id}
                    className="p-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    {/* Platform badges */}
                    <div className="flex gap-1 mb-1.5 flex-wrap">
                      {pub.targetPlatforms.map((platform) => (
                        <span
                          key={platform}
                          className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: PLATFORM_COLORS[platform] }}
                        >
                          {PLATFORM_LABELS[platform]}
                        </span>
                      ))}
                    </div>
                    <p className="text-[12px] text-[var(--text-primary)] line-clamp-3 leading-relaxed">
                      {pub.text}
                    </p>
                    {pub.scheduledAt && (
                      <p className="text-[10px] text-[var(--text-tertiary)] mt-1.5">
                        {format(new Date(pub.scheduledAt), 'h:mm a')}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-1.5">
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          pub.status === 'published'
                            ? 'bg-green-50 text-green-600'
                            : pub.status === 'scheduled'
                            ? 'bg-blue-50 text-blue-600'
                            : pub.status === 'draft'
                            ? 'bg-gray-50 text-gray-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {pub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
