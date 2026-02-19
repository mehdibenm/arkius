'use client';

import {
  startOfYear,
  eachMonthOfInterval,
  endOfYear,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  isToday,
} from 'date-fns';
import { useAppStore } from '@/lib/store';

export default function YearView() {
  const { selectedDate, publications, setSelectedDate, setCalendarView } = useAppStore();

  const yearStart = startOfYear(selectedDate);
  const yearEnd = endOfYear(selectedDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const hasPublicationOnDay = (day: Date): boolean => {
    return publications.some((pub) => {
      const pubDate = pub.scheduledAt
        ? new Date(pub.scheduledAt)
        : new Date(pub.createdAt);
      return isSameDay(pubDate, day);
    });
  };

  const getPublicationCountForMonth = (month: Date): number => {
    const mStart = startOfMonth(month);
    const mEnd = endOfMonth(month);
    return publications.filter((pub) => {
      const pubDate = pub.scheduledAt
        ? new Date(pub.scheduledAt)
        : new Date(pub.createdAt);
      return pubDate >= mStart && pubDate <= mEnd;
    }).length;
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {months.map((month) => {
        const mStart = startOfMonth(month);
        const mEnd = endOfMonth(month);
        const calStart = startOfWeek(mStart);
        const calEnd = endOfWeek(mEnd);
        const days = eachDayOfInterval({ start: calStart, end: calEnd });
        const pubCount = getPublicationCountForMonth(month);

        return (
          <div
            key={month.toISOString()}
            className="apple-card p-4 cursor-pointer hover:border-[var(--accent)] transition-colors"
            onClick={() => {
              setSelectedDate(month);
              setCalendarView('month');
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                {format(month, 'MMMM')}
              </h3>
              {pubCount > 0 && (
                <span className="text-[11px] text-[var(--accent)] font-medium">
                  {pubCount} post{pubCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Mini calendar */}
            <div className="grid grid-cols-7 gap-0.5">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div
                  key={i}
                  className="text-[9px] text-center text-[var(--text-tertiary)] font-medium py-0.5"
                >
                  {d}
                </div>
              ))}
              {days.map((day) => {
                const inMonth = isSameMonth(day, month);
                const today = isToday(day);
                const hasPub = hasPublicationOnDay(day);

                return (
                  <div
                    key={day.toISOString()}
                    className={`text-[10px] text-center py-0.5 rounded ${
                      !inMonth
                        ? 'text-transparent'
                        : today
                        ? 'bg-[var(--accent)] text-white font-bold'
                        : hasPub
                        ? 'bg-[var(--accent)] bg-opacity-20 text-[var(--accent)] font-medium'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
