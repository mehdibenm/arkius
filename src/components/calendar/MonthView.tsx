'use client';

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
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

export default function MonthView() {
  const { selectedDate, publications } = useAppStore();

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getPublicationsForDay = (day: Date): Publication[] => {
    return publications.filter((pub) => {
      const pubDate = pub.scheduledAt
        ? new Date(pub.scheduledAt)
        : new Date(pub.createdAt);
      return isSameDay(pubDate, day);
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="apple-card">
      {/* Header */}
      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-[12px] font-semibold text-[var(--text-secondary)] border-b border-[var(--border-light)]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayPubs = getPublicationsForDay(day);
          const inMonth = isSameMonth(day, selectedDate);
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`calendar-cell ${today ? 'today' : ''}`}
            >
              <div className="flex items-center justify-between mb-1 px-1">
                <span
                  className={`text-[12px] font-medium ${
                    !inMonth
                      ? 'text-[var(--text-tertiary)] opacity-40'
                      : today
                      ? 'text-[var(--accent)] font-semibold'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {dayPubs.length > 0 && (
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    {dayPubs.length}
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                {dayPubs.slice(0, 3).map((pub) => (
                  <div
                    key={pub.id}
                    className="calendar-event text-white"
                    style={{
                      backgroundColor:
                        PLATFORM_COLORS[pub.targetPlatforms[0]] || '#6e6e73',
                    }}
                    title={pub.text}
                  >
                    {pub.text.substring(0, 30)}
                  </div>
                ))}
                {dayPubs.length > 3 && (
                  <div className="text-[10px] text-[var(--text-tertiary)] px-1">
                    +{dayPubs.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
