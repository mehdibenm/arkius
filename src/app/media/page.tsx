'use client';

import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import {
  Search,
  Upload,
  Film,
  ImageIcon,
  Trash2,
  Grid,
  List,
  Filter,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/lib/store';
import {
  getUserMediaFiles,
  addMediaFile as addMediaFileToDb,
  deleteMediaFile as deleteMediaFileFromDb,
} from '@/lib/firestore';
import { uploadMedia, getMediaType, getMediaFormat } from '@/lib/storage';
import AppLayout from '@/components/layout/AppLayout';
import type { MediaFile, MediaType } from '@/types';

export default function MediaLibraryPage() {
  const { user } = useAuth();
  const { mediaFiles, setMediaFiles, addMediaFile, removeMediaFile, mediaFilter, setMediaFilter } =
    useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'format'>('date');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getUserMediaFiles(user.uid).then(setMediaFiles).catch(console.error);
    }
  }, [user, setMediaFiles]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !user) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const { url } = await uploadMedia(file, user.uid);
        const mediaFile: MediaFile = {
          id: uuidv4(),
          userId: user.uid,
          name: file.name,
          type: getMediaType(file),
          format: getMediaFormat(file),
          url,
          size: file.size,
          createdAt: new Date().toISOString(),
        };
        await addMediaFileToDb(mediaFile);
        addMediaFile(mediaFile);
        toast.success(`Uploaded ${file.name}`);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMediaFileFromDb(id);
      removeMediaFile(id);
      toast.success('File deleted');
    } catch {
      toast.error('Failed to delete file');
    }
  };

  const filteredFiles = mediaFiles
    .filter((f) => {
      if (mediaFilter.type !== 'all' && f.type !== mediaFilter.type) return false;
      if (
        mediaFilter.search &&
        !f.name.toLowerCase().includes(mediaFilter.search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return a.format.localeCompare(b.format);
    });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[24px] font-semibold text-[var(--text-primary)]">
            Media Library
          </h2>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} stored
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="apple-btn apple-btn-primary"
        >
          {uploading ? <span className="spinner" /> : <Upload size={16} />}
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Filters bar */}
      <div className="apple-card p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="text"
              className="apple-input pl-9 text-[13px]"
              placeholder="Search files..."
              value={mediaFilter.search}
              onChange={(e) => setMediaFilter({ search: e.target.value })}
            />
          </div>

          {/* Type filter */}
          <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1">
            {(['all', 'image', 'video'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMediaFilter({ type })}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all capitalize flex items-center gap-1.5 ${
                  mediaFilter.type === type
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {type === 'image' && <ImageIcon size={12} />}
                {type === 'video' && <Film size={12} />}
                {type === 'all' && <Filter size={12} />}
                {type}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1">
            {([
              { key: 'date', icon: <Calendar size={12} />, label: 'Date' },
              { key: 'type', icon: <ImageIcon size={12} />, label: 'Type' },
              { key: 'format', icon: <Filter size={12} />, label: 'Format' },
            ] as const).map((s) => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all flex items-center gap-1.5 ${
                  sortBy === s.key
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>

          {/* View mode */}
          <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-[var(--bg-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-[var(--bg-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* File grid/list */}
      {filteredFiles.length === 0 ? (
        <div className="apple-card p-12 text-center">
          <ImageIcon size={40} className="mx-auto mb-3 text-[var(--text-tertiary)]" />
          <p className="text-[15px] text-[var(--text-secondary)]">No media files found</p>
          <p className="text-[13px] text-[var(--text-tertiary)] mt-1">
            Upload images and videos to get started
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <div key={file.id} className="apple-card group relative">
              <div className="aspect-square bg-[var(--bg-tertiary)] relative">
                {file.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film size={32} className="text-[var(--text-tertiary)]" />
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Type badge */}
                <span
                  className={`absolute top-2 left-2 text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${
                    file.type === 'video' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}
                >
                  {file.format.toUpperCase()}
                </span>
                {/* Delete overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-opacity"
                  >
                    <Trash2 size={14} className="text-[var(--danger)]" />
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">
                  {file.name}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  {formatFileSize(file.size)} - {format(new Date(file.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="apple-card divide-y divide-[var(--border-light)]">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-3 hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden shrink-0">
                {file.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film size={20} className="text-[var(--text-tertiary)]" />
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                  {file.name}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  {file.format.toUpperCase()} - {formatFileSize(file.size)}
                </p>
              </div>
              <span className="text-[12px] text-[var(--text-tertiary)]">
                {format(new Date(file.createdAt), 'MMM d, yyyy')}
              </span>
              <button
                onClick={() => handleDelete(file.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
