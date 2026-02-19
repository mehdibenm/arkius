'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  FileText,
  Trash2,
  Edit3,
  Send,
  Clock,
  ImageIcon,
  Film,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/lib/store';
import {
  getUserDrafts,
  deletePublication,
  updatePublication as updatePubInDb,
} from '@/lib/firestore';
import AppLayout from '@/components/layout/AppLayout';
import type { Publication, SocialNetwork } from '@/types';

const PLATFORM_COLORS: Record<SocialNetwork, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  tiktok: '#000000',
};

const PLATFORM_LABELS: Record<SocialNetwork, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
};

export default function DraftsPage() {
  const { user } = useAuth();
  const { publications, setPublications, removePublication } = useAppStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const drafts = publications.filter((p) => p.status === 'draft');

  useEffect(() => {
    if (user) {
      getUserDrafts(user.uid)
        .then((d) => {
          setPublications(d);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user, setPublications]);

  const handleDelete = async (id: string) => {
    try {
      await deletePublication(id);
      removePublication(id);
      toast.success('Draft deleted');
    } catch {
      toast.error('Failed to delete draft');
    }
  };

  const handlePublishNow = async (draft: Publication) => {
    try {
      await updatePubInDb(draft.id, {
        status: 'published',
        publishedAt: new Date().toISOString(),
      });
      removePublication(draft.id);
      toast.success('Published successfully!');
    } catch {
      toast.error('Failed to publish');
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)]">
          Drafts
        </h2>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">
          {drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      ) : drafts.length === 0 ? (
        <div className="apple-card p-12 text-center">
          <FileText
            size={40}
            className="mx-auto mb-3 text-[var(--text-tertiary)]"
          />
          <p className="text-[15px] text-[var(--text-secondary)]">
            No drafts yet
          </p>
          <p className="text-[13px] text-[var(--text-tertiary)] mt-1">
            Create a post and save it as a draft to see it here
          </p>
          <button
            onClick={() => router.push('/compose')}
            className="apple-btn apple-btn-primary mt-4"
          >
            Create Post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="apple-card p-5 flex gap-4 fade-in"
            >
              {/* Media preview */}
              <div className="w-20 h-20 rounded-xl bg-[var(--bg-tertiary)] shrink-0 flex items-center justify-center overflow-hidden">
                {draft.mediaIds.length > 0 ? (
                  <ImageIcon
                    size={24}
                    className="text-[var(--text-tertiary)]"
                  />
                ) : (
                  <FileText
                    size={24}
                    className="text-[var(--text-tertiary)]"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[var(--text-primary)] line-clamp-2 leading-relaxed">
                  {draft.text || 'No text content'}
                </p>

                {/* Platform badges */}
                <div className="flex items-center gap-1.5 mt-2">
                  {draft.targetPlatforms.map((platform) => (
                    <span
                      key={platform}
                      className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: PLATFORM_COLORS[platform],
                      }}
                    >
                      {PLATFORM_LABELS[platform]}
                    </span>
                  ))}
                </div>

                <p className="text-[11px] text-[var(--text-tertiary)] mt-2">
                  Created {format(new Date(draft.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-start gap-1.5 shrink-0">
                <button
                  onClick={() => handlePublishNow(draft)}
                  className="apple-btn apple-btn-primary text-[12px] py-1.5 px-3"
                  title="Publish now"
                >
                  <Send size={12} /> Publish
                </button>
                <button
                  onClick={() => handleDelete(draft.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors"
                  title="Delete draft"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
