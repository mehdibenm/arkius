'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/lib/store';
import Sidebar from './Sidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { sidebarOpen } = useAppStore();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" style={{ width: 40, height: 40, borderWidth: 3 }} />
          <p className="text-[var(--text-secondary)] text-[15px]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid var(--border-light)',
            fontSize: '14px',
          },
        }}
      />
      <Sidebar />
      <main
        style={{
          marginLeft: sidebarOpen ? 'var(--sidebar-width)' : '72px',
        }}
        className="min-h-screen transition-all duration-300"
      >
        <div className="p-6 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
