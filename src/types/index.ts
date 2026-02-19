export type SocialNetwork = 'instagram' | 'facebook' | 'linkedin' | 'tiktok';

export type PublicationStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export type MediaType = 'image' | 'video';

export type CalendarView = 'week' | 'month' | 'year';

export type UserRole = 'admin' | 'user';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  description?: string;
  logoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  id: string;
  userId: string;
  platform: SocialNetwork;
  accountName: string;
  accountId: string;
  accessToken: string;
  refreshToken?: string;
  profileImageURL?: string;
  connected: boolean;
  connectedAt: string;
}

export interface MediaFile {
  id: string;
  userId: string;
  name: string;
  type: MediaType;
  format: string;
  url: string;
  thumbnailURL?: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  createdAt: string;
  tags?: string[];
}

export interface Publication {
  id: string;
  userId: string;
  text: string;
  textLinkedin?: string;
  mediaIds: string[];
  media?: MediaFile[];
  targetAccounts: string[];
  targetPlatforms: SocialNetwork[];
  status: PublicationStatus;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Draft extends Publication {
  status: 'draft';
}

export interface PlatformLimits {
  maxTextLength: number;
  maxHashtags?: number;
  imageFormats: string[];
  videoFormats: string[];
  maxImageSize: number;
  maxVideoSize: number;
  maxVideoDuration?: number;
  aspectRatios: string[];
}

export const PLATFORM_LIMITS: Record<SocialNetwork, PlatformLimits> = {
  instagram: {
    maxTextLength: 2200,
    maxHashtags: 30,
    imageFormats: ['jpg', 'jpeg', 'png'],
    videoFormats: ['mp4', 'mov'],
    maxImageSize: 30 * 1024 * 1024,
    maxVideoSize: 4 * 1024 * 1024 * 1024,
    maxVideoDuration: 90,
    aspectRatios: ['1:1', '4:5', '16:9'],
  },
  facebook: {
    maxTextLength: 63206,
    imageFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'],
    videoFormats: ['mp4', 'mov', 'avi', 'wmv'],
    maxImageSize: 10 * 1024 * 1024,
    maxVideoSize: 10 * 1024 * 1024 * 1024,
    maxVideoDuration: 240,
    aspectRatios: ['16:9', '1:1', '4:5', '2:3', '9:16'],
  },
  linkedin: {
    maxTextLength: 3000,
    imageFormats: ['jpg', 'jpeg', 'png', 'gif'],
    videoFormats: ['mp4'],
    maxImageSize: 10 * 1024 * 1024,
    maxVideoSize: 5 * 1024 * 1024 * 1024,
    maxVideoDuration: 600,
    aspectRatios: ['1:1', '16:9', '1.91:1'],
  },
  tiktok: {
    maxTextLength: 2200,
    maxHashtags: 100,
    imageFormats: ['jpg', 'jpeg', 'png'],
    videoFormats: ['mp4', 'mov'],
    maxImageSize: 10 * 1024 * 1024,
    maxVideoSize: 4 * 1024 * 1024 * 1024,
    maxVideoDuration: 600,
    aspectRatios: ['9:16', '1:1'],
  },
};
