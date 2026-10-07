import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types';

interface SettingsContextValue {
  settings: SiteSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  whatsappLink: (message?: string) => string;
  whatsappPhone: string;
  siteName: string;
  socialLinks: { url: string; label: string }[];
  phoneNumbers: string[];
  callLink: (phone: string) => string;
}

const defaultSettings: SiteSettings = {
  id: 1,
  whatsapp_phone: '966500000000',
  site_name: 'الفرسان للدهانات',
  phone_1: '01069949029',
  phone_2: '01228992877',
  instagram_url: null,
  facebook_url: null,
  tiktok_url: null,
  snapchat_url: null,
  x_url: null,
  youtube_url: null,
  updated_at: '',
};

const DEFAULT_MESSAGE = 'مرحباً، أرغب في الاستفسار عن حجز خدمة دهانات / أعمال فنية.';

const SOCIAL_LABELS: Record<string, string> = {
  instagram_url: 'انستغرام',
  facebook_url: 'فيسبوك',
  tiktok_url: 'تيك توك',
  snapchat_url: 'سناب شات',
  x_url: 'X (تويتر)',
  youtube_url: 'يوتيوب',
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (data) setSettings(data as SiteSettings);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const whatsappLink = useCallback(
    (message: string = DEFAULT_MESSAGE) => {
      const phone = settings.whatsapp_phone.replace(/\D/g, '');
      return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    },
    [settings.whatsapp_phone],
  );

  const socialLinks = useCallback(() => {
    const result: { url: string; label: string }[] = [];
    (Object.keys(SOCIAL_LABELS) as string[]).forEach((key) => {
      const url = settings[key as keyof SiteSettings] as string | null;
      if (url && url.trim()) {
        result.push({ url: url.trim(), label: SOCIAL_LABELS[key] });
      }
    });
    return result;
  }, [settings])();

  const phoneNumbers = useCallback(() => {
    const nums: string[] = [];
    if (settings.phone_1 && settings.phone_1.trim()) nums.push(settings.phone_1.trim());
    if (settings.phone_2 && settings.phone_2.trim()) nums.push(settings.phone_2.trim());
    return nums;
  }, [settings])();

  const callLink = useCallback((phone: string) => `tel:${phone.replace(/\s/g, '')}`, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings,
        whatsappLink,
        whatsappPhone: settings.whatsapp_phone,
        siteName: settings.site_name,
        socialLinks,
        phoneNumbers,
        callLink,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
