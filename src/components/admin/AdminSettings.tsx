import { useState, useEffect, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/contexts/SettingsContext';
import type { SiteSettings } from '@/lib/types';
import { SOCIAL_LINKS } from '@/lib/types';
import {
  Loader2, Check, AlertCircle, Save, MessageCircle,
  Instagram, Facebook, Youtube, Twitter, Share2, Phone as PhoneIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, typeof Instagram> = {
  instagram_url: Instagram,
  facebook_url: Facebook,
  tiktok_url: Share2,
  snapchat_url: Share2,
  x_url: Twitter,
  youtube_url: Youtube,
};

const PLACEHOLDERS: Record<string, string> = {
  instagram_url: 'https://instagram.com/your_page',
  facebook_url: 'https://facebook.com/your_page',
  tiktok_url: 'https://tiktok.com/@your_page',
  snapchat_url: 'https://snapchat.com/add/your_user',
  x_url: 'https://x.com/your_page',
  youtube_url: 'https://youtube.com/@your_channel',
};

export function AdminSettings() {
  const { settings, refreshSettings } = useSettings();
  const [phone, setPhone] = useState('');
  const [siteName, setSiteName] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [socialUrls, setSocialUrls] = useState<Record<string, string>>({
    instagram_url: '',
    facebook_url: '',
    tiktok_url: '',
    snapchat_url: '',
    x_url: '',
    youtube_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setPhone(settings.whatsapp_phone);
      setSiteName(settings.site_name);
      setPhone1(settings.phone_1 ?? '');
      setPhone2(settings.phone_2 ?? '');
      const urls: Record<string, string> = {};
      SOCIAL_LINKS.forEach((link) => {
        urls[link.key] = (settings[link.key] as string | null) ?? '';
      });
      setSocialUrls(urls);
    }
  }, [settings]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      setError('يرجى إدخال رقم واتساب صحيح');
      return;
    }
    if (!siteName.trim()) {
      setError('يرجى إدخال اسم الموقع');
      return;
    }

    setSaving(true);

    const updateData: Partial<SiteSettings> = {
      whatsapp_phone: cleanPhone,
      site_name: siteName.trim(),
      phone_1: phone1.trim() || null,
      phone_2: phone2.trim() || null,
      updated_at: new Date().toISOString(),
    };
    SOCIAL_LINKS.forEach((link) => {
      const val = socialUrls[link.key]?.trim();
      updateData[link.key] = val || null;
    });

    const { error: updateError } = await supabase
      .from('site_settings')
      .update(updateData)
      .eq('id', 1);

    if (updateError) {
      setError('فشل تحديث الإعدادات: ' + updateError.message);
    } else {
      setSuccess(true);
      await refreshSettings();
      setTimeout(() => setSuccess(false), 3000);
    }

    setSaving(false);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal-900">إعدادات التواصل</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          تحديث رقم واتساب واسم الموقع وروابط وسائل التواصل الاجتماعي
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Contact settings form */}
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-charcoal-100 lg:p-8">
          {/* Site name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal-700">اسم الموقع</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-800 transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              placeholder="الفرسان للدهانات"
            />
            <p className="mt-2 text-xs text-charcoal-400">
              يظهر هذا الاسم في رأس الموقع والتذييل وصفحة تسجيل الدخول
            </p>
          </div>

          {/* WhatsApp phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal-700">رقم واتساب</label>
            <div className="relative">
              <MessageCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={saving}
                className="w-full rounded-xl border border-charcoal-200 bg-white py-3 pr-11 pl-4 text-sm font-medium text-charcoal-800 transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                placeholder="966500000000"
                dir="ltr"
              />
            </div>
            <p className="mt-2 text-xs text-charcoal-400">
              أدخل الرقم مع رمز الدولة بدون + أو مسافات (مثال: 9665XXXXXXXX)
            </p>
          </div>

          {/* Preview link */}
          <div className="rounded-2xl bg-green-50 p-5">
            <p className="text-sm font-medium text-green-800">معاينة رابط واتساب:</p>
            <p className="mt-2 break-all text-xs text-green-600" dir="ltr">
              https://wa.me/{phone.replace(/\D/g, '')}?text=مرحباً، أرغب في الاستفسار عن حجز خدمة دهانات / أعمال فنية.
            </p>
          </div>

          {/* Phone numbers for direct calls */}
          <div className="border-t border-charcoal-100 pt-6">
            <h3 className="mb-4 font-bold text-charcoal-900">أرقام الاتصال المباشر</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal-700">رقم الهاتف الأول</label>
                <div className="relative">
                  <PhoneIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-500" />
                  <input
                    type="tel"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                    disabled={saving}
                    className="w-full rounded-xl border border-charcoal-200 bg-white py-3 pr-11 pl-4 text-sm font-medium text-charcoal-800 transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                    placeholder="01069949029"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal-700">رقم الهاتف الثاني</label>
                <div className="relative">
                  <PhoneIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-500" />
                  <input
                    type="tel"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                    disabled={saving}
                    className="w-full rounded-xl border border-charcoal-200 bg-white py-3 pr-11 pl-4 text-sm font-medium text-charcoal-800 transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                    placeholder="01228992877"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-charcoal-400">
              تظهر هذه الأرقام في قسم التواصل ويمكن للعملاء الاتصال بها مباشرة بالضغط عليها
            </p>
          </div>
        </form>

        {/* Social media links form */}
        <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-charcoal-100 lg:p-8">
          <div className="flex items-center gap-2 border-b border-charcoal-100 pb-4">
            <Share2 className="h-5 w-5 text-gold-500" />
            <h3 className="font-bold text-charcoal-900">وسائل التواصل الاجتماعي</h3>
          </div>
          <p className="-mt-2 text-xs text-charcoal-400">
            اترك الحقل فارغاً إذا لم تكن تريد عرض الرابط في الموقع
          </p>

          {SOCIAL_LINKS.map((link) => {
            const Icon = ICON_MAP[link.key];
            return (
              <div key={link.key}>
                <label className="mb-2 block text-sm font-medium text-charcoal-700">{link.label}</label>
                <div className="relative">
                  <Icon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-300" />
                  <input
                    type="url"
                    value={socialUrls[link.key] ?? ''}
                    onChange={(e) => setSocialUrls((prev) => ({ ...prev, [link.key]: e.target.value }))}
                    disabled={saving}
                    className="w-full rounded-xl border border-charcoal-200 bg-white py-3 pr-11 pl-4 text-sm font-medium text-charcoal-800 transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                    placeholder={PLACEHOLDERS[link.key]}
                    dir="ltr"
                  />
                </div>
              </div>
            );
          })}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 animate-fade-in">
              <Check className="h-5 w-5 flex-shrink-0" />
              تم حفظ الإعدادات بنجاح
            </div>
          )}

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-600 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                حفظ الإعدادات
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
