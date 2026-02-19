'use client';

import { useState } from 'react';
import { Send, Clock, FileText, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/lib/store';
import { uploadMedia, getMediaType, getMediaFormat } from '@/lib/storage';
import { createPublication, addMediaFile as addMediaFileToDb } from '@/lib/firestore';
import type { Publication, MediaFile } from '@/types';

export default function PublishActions() {
  const { user } = useAuth();
  const {
    composerText,
    composerTextLinkedin,
    useLinkedinSeparateText,
    composerMedia,
    selectedAccounts,
    accounts,
    resetComposer,
    addPublication,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const selectedPlatforms = [
    ...new Set(
      accounts
        .filter((a) => selectedAccounts.includes(a.id))
        .map((a) => a.platform)
    ),
  ];

  const canPublish =
    composerText.trim().length > 0 && selectedAccounts.length > 0;

  const uploadAllMedia = async (): Promise<MediaFile[]> => {
    if (!user) return [];
    const uploaded: MediaFile[] = [];

    for (const file of composerMedia) {
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
      uploaded.push(mediaFile);
    }

    return uploaded;
  };

  const handleAction = async (action: 'publish' | 'schedule' | 'draft') => {
    if (!user) return;
    if (action !== 'draft' && !canPublish) return;

    setLoading(true);
    try {
      // Upload media
      const mediaFiles = await uploadAllMedia();

      const publication: Publication = {
        id: uuidv4(),
        userId: user.uid,
        text: composerText,
        textLinkedin: useLinkedinSeparateText ? composerTextLinkedin : undefined,
        mediaIds: mediaFiles.map((m) => m.id),
        targetAccounts: selectedAccounts,
        targetPlatforms: selectedPlatforms,
        status:
          action === 'draft'
            ? 'draft'
            : action === 'schedule'
            ? 'scheduled'
            : 'published',
        scheduledAt:
          action === 'schedule' && scheduleDate && scheduleTime
            ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
            : undefined,
        publishedAt:
          action === 'publish' ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createPublication(publication);
      addPublication(publication);

      const messages = {
        publish: 'Published successfully!',
        schedule: 'Scheduled successfully!',
        draft: 'Saved as draft.',
      };
      toast.success(messages[action]);
      resetComposer();
      setShowSchedule(false);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Schedule picker */}
      {showSchedule && (
        <div className="apple-card p-4 space-y-3 fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-[14px] font-medium text-[var(--text-primary)]">
              Schedule Publication
            </h4>
            <button
              onClick={() => setShowSchedule(false)}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[var(--text-secondary)] mb-1">
                Date
              </label>
              <input
                type="date"
                className="apple-input text-[13px]"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] text-[var(--text-secondary)] mb-1">
                Time
              </label>
              <input
                type="time"
                className="apple-input text-[13px]"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => handleAction('schedule')}
            disabled={loading || !canPublish || !scheduleDate || !scheduleTime}
            className="apple-btn apple-btn-primary w-full text-[13px]"
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <Clock size={14} /> Confirm Schedule
              </>
            )}
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleAction('draft')}
          disabled={loading || composerText.trim().length === 0}
          className="apple-btn apple-btn-secondary flex-1 text-[13px]"
        >
          <FileText size={14} /> Draft
        </button>
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          disabled={loading || !canPublish}
          className="apple-btn apple-btn-secondary flex-1 text-[13px]"
        >
          <Clock size={14} /> Schedule
        </button>
        <button
          onClick={() => handleAction('publish')}
          disabled={loading || !canPublish}
          className="apple-btn apple-btn-primary flex-1 text-[13px]"
        >
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              <Send size={14} /> Publish
            </>
          )}
        </button>
      </div>
    </div>
  );
}
