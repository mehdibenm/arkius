import { create } from 'zustand';
import type {
  SocialAccount,
  MediaFile,
  Publication,
  CalendarView,
  SocialNetwork,
} from '@/types';

interface AppState {
  // Social accounts
  accounts: SocialAccount[];
  setAccounts: (accounts: SocialAccount[]) => void;
  addAccount: (account: SocialAccount) => void;
  removeAccount: (id: string) => void;

  // Media library
  mediaFiles: MediaFile[];
  setMediaFiles: (files: MediaFile[]) => void;
  addMediaFile: (file: MediaFile) => void;
  removeMediaFile: (id: string) => void;
  mediaFilter: { type: 'all' | 'image' | 'video'; search: string };
  setMediaFilter: (filter: Partial<AppState['mediaFilter']>) => void;

  // Publications
  publications: Publication[];
  setPublications: (pubs: Publication[]) => void;
  addPublication: (pub: Publication) => void;
  updatePublication: (id: string, data: Partial<Publication>) => void;
  removePublication: (id: string) => void;

  // Calendar
  calendarView: CalendarView;
  setCalendarView: (view: CalendarView) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

  // Composer
  composerText: string;
  setComposerText: (text: string) => void;
  composerTextLinkedin: string;
  setComposerTextLinkedin: (text: string) => void;
  useLinkedinSeparateText: boolean;
  setUseLinkedinSeparateText: (use: boolean) => void;
  composerMedia: File[];
  setComposerMedia: (files: File[]) => void;
  addComposerMedia: (file: File) => void;
  removeComposerMedia: (index: number) => void;
  selectedAccounts: string[];
  setSelectedAccounts: (ids: string[]) => void;
  toggleAccount: (id: string) => void;
  previewPlatform: SocialNetwork;
  setPreviewPlatform: (platform: SocialNetwork) => void;
  resetComposer: () => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mediaLibraryOpen: boolean;
  setMediaLibraryOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Social accounts
  accounts: [],
  setAccounts: (accounts) => set({ accounts }),
  addAccount: (account) => set((s) => ({ accounts: [...s.accounts, account] })),
  removeAccount: (id) =>
    set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) })),

  // Media library
  mediaFiles: [],
  setMediaFiles: (mediaFiles) => set({ mediaFiles }),
  addMediaFile: (file) => set((s) => ({ mediaFiles: [file, ...s.mediaFiles] })),
  removeMediaFile: (id) =>
    set((s) => ({ mediaFiles: s.mediaFiles.filter((f) => f.id !== id) })),
  mediaFilter: { type: 'all', search: '' },
  setMediaFilter: (filter) =>
    set((s) => ({ mediaFilter: { ...s.mediaFilter, ...filter } })),

  // Publications
  publications: [],
  setPublications: (publications) => set({ publications }),
  addPublication: (pub) =>
    set((s) => ({ publications: [pub, ...s.publications] })),
  updatePublication: (id, data) =>
    set((s) => ({
      publications: s.publications.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    })),
  removePublication: (id) =>
    set((s) => ({ publications: s.publications.filter((p) => p.id !== id) })),

  // Calendar
  calendarView: 'month',
  setCalendarView: (calendarView) => set({ calendarView }),
  selectedDate: new Date(),
  setSelectedDate: (selectedDate) => set({ selectedDate }),

  // Composer
  composerText: '',
  setComposerText: (composerText) => set({ composerText }),
  composerTextLinkedin: '',
  setComposerTextLinkedin: (composerTextLinkedin) => set({ composerTextLinkedin }),
  useLinkedinSeparateText: false,
  setUseLinkedinSeparateText: (useLinkedinSeparateText) =>
    set({ useLinkedinSeparateText }),
  composerMedia: [],
  setComposerMedia: (composerMedia) => set({ composerMedia }),
  addComposerMedia: (file) =>
    set((s) => ({ composerMedia: [...s.composerMedia, file] })),
  removeComposerMedia: (index) =>
    set((s) => ({
      composerMedia: s.composerMedia.filter((_, i) => i !== index),
    })),
  selectedAccounts: [],
  setSelectedAccounts: (selectedAccounts) => set({ selectedAccounts }),
  toggleAccount: (id) =>
    set((s) => ({
      selectedAccounts: s.selectedAccounts.includes(id)
        ? s.selectedAccounts.filter((a) => a !== id)
        : [...s.selectedAccounts, id],
    })),
  previewPlatform: 'instagram',
  setPreviewPlatform: (previewPlatform) => set({ previewPlatform }),
  resetComposer: () =>
    set({
      composerText: '',
      composerTextLinkedin: '',
      useLinkedinSeparateText: false,
      composerMedia: [],
      selectedAccounts: [],
    }),

  // Sidebar
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  mediaLibraryOpen: false,
  setMediaLibraryOpen: (mediaLibraryOpen) => set({ mediaLibraryOpen }),
}));
