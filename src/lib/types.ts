export type GalleryCategory = 'wall_paint' | 'artwork';
export type MediaType = 'photo' | 'video';

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  category: GalleryCategory;
  media_type: MediaType;
  media_url: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  whatsapp_phone: string;
  site_name: string;
  phone_1: string | null;
  phone_2: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  snapchat_url: string | null;
  x_url: string | null;
  youtube_url: string | null;
  updated_at: string;
}

export interface GalleryItemInput {
  title: string;
  description: string | null;
  category: GalleryCategory;
  media_type: MediaType;
  media_url: string;
  storage_path: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  wall_paint: 'دهانات حوائط',
  artwork: 'أعمال فنية',
};

export const MEDIA_TYPE_LABELS: Record<string, string> = {
  photo: 'صورة',
  video: 'فيديو',
};

export interface SocialLink {
  key: keyof Pick<SiteSettings, 'instagram_url' | 'facebook_url' | 'tiktok_url' | 'snapchat_url' | 'x_url' | 'youtube_url'>;
  label: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'instagram_url', label: 'انستغرام' },
  { key: 'facebook_url', label: 'فيسبوك' },
  { key: 'tiktok_url', label: 'تيك توك' },
  { key: 'snapchat_url', label: 'سناب شات' },
  { key: 'x_url', label: 'X (تويتر)' },
  { key: 'youtube_url', label: 'يوتيوب' },
];
