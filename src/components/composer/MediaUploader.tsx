'use client';

import { useRef, useState } from 'react';
import { Upload, X, Film, ImageIcon } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function MediaUploader() {
  const { composerMedia, addComposerMedia, removeComposerMedia } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        addComposerMedia(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <label className="text-[13px] font-medium text-[var(--text-secondary)]">
        Media
      </label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-[var(--accent)] bg-blue-50'
            : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)]'
        }`}
      >
        <Upload size={24} className="mx-auto mb-2 text-[var(--text-tertiary)]" />
        <p className="text-[13px] text-[var(--text-secondary)]">
          Drop images or videos here, or click to browse
        </p>
        <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
          JPG, PNG, GIF, MP4, MOV
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Preview thumbnails */}
      {composerMedia.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {composerMedia.map((file, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden bg-[var(--bg-tertiary)] group"
            >
              {file.type.startsWith('video/') ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Film size={24} className="text-[var(--text-tertiary)]" />
                  <video
                    src={URL.createObjectURL(file)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeComposerMedia(index);
                  }}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center transition-opacity"
                >
                  <X size={14} className="text-[var(--danger)]" />
                </button>
              </div>

              {/* Type badge */}
              <div className="absolute bottom-1 left-1">
                {file.type.startsWith('video/') ? (
                  <Film size={12} className="text-white drop-shadow" />
                ) : (
                  <ImageIcon size={12} className="text-white drop-shadow" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
