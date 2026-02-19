'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  PenSquare,
  FileText,
  Image,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/lib/store';

const navItems = [
  { href: '/dashboard', label: 'Planning', icon: Calendar },
  { href: '/compose', label: 'Create Post', icon: PenSquare },
  { href: '/drafts', label: 'Drafts', icon: FileText },
  { href: '/media', label: 'Media Library', icon: Image },
  { href: '/accounts', label: 'Accounts', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <aside
      style={{ width: sidebarOpen ? 'var(--sidebar-width)' : '72px' }}
      className="fixed left-0 top-0 h-screen bg-[var(--bg-primary)] border-r border-[var(--border-light)] flex flex-col z-30 transition-all duration-300"
    >
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-[var(--border-light)]">
        <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm shrink-0">
          FMF
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="text-[15px] font-semibold text-[var(--text-primary)] whitespace-nowrap">
              FMF Social Media
            </h1>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all no-underline ${
                isActive
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon size={20} className="shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-[var(--border-light)]">
        {sidebarOpen && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
              {user.displayName}
            </p>
            <p className="text-[11px] text-[var(--text-tertiary)] truncate">
              {user.email}
            </p>
          </div>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--danger)] transition-all w-full"
        >
          <LogOut size={20} className="shrink-0" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-primary)] border border-[var(--border-light)] flex items-center justify-center shadow-sm hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </aside>
  );
}
