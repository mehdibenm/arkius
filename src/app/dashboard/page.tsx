'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/lib/store';
import { getUserPublications } from '@/lib/firestore';
import AppLayout from '@/components/layout/AppLayout';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import MonthView from '@/components/calendar/MonthView';
import WeekView from '@/components/calendar/WeekView';
import YearView from '@/components/calendar/YearView';

export default function DashboardPage() {
  const { user } = useAuth();
  const { calendarView, setPublications } = useAppStore();

  useEffect(() => {
    if (user) {
      getUserPublications(user.uid).then(setPublications).catch(console.error);
    }
  }, [user, setPublications]);

  return (
    <AppLayout>
      <CalendarHeader />
      {calendarView === 'month' && <MonthView />}
      {calendarView === 'week' && <WeekView />}
      {calendarView === 'year' && <YearView />}
    </AppLayout>
  );
}
