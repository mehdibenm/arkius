'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addYears, subYears } from 'date-fns';
import { useAppStore } from '@/lib/store';
import type { CalendarView } from '@/types';

export default function CalendarHeader() {
  const { calendarView, setCalendarView, selectedDate, setSelectedDate } = useAppStore();

  const views: CalendarView[] = ['week', 'month', 'year'];

  const navigate = (direction: 'prev' | 'next') => {
    const fn = direction === 'next'
      ? calendarView === 'week' ? addWeeks : calendarView === 'month' ? addMonths : addYears
      : calendarView === 'week' ? subWeeks : calendarView === 'month' ? subMonths : subYears;
    setSelectedDate(fn(selectedDate, 1));
  };

  const getTitle = () => {
    if (calendarView === 'week') {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    }
    if (calendarView === 'month') return format(selectedDate, 'MMMM yyyy');
    return format(selectedDate, 'yyyy');
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)]">
          Planning Agenda
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('prev')}
            className="apple-btn apple-btn-ghost p-2"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-[15px] font-medium text-[var(--text-primary)] min-w-[200px] text-center">
            {getTitle()}
          </span>
          <button
            onClick={() => navigate('next')}
            className="apple-btn apple-btn-ghost p-2"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="apple-btn apple-btn-secondary text-[13px] py-1.5 px-3 ml-2"
          >
            Today
          </button>
        </div>
      </div>

      <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1">
        {views.map((view) => (
          <button
            key={view}
            onClick={() => setCalendarView(view)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all capitalize ${
              calendarView === view
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
}
