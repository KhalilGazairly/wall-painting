import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users,
  MousePointerClick,
  TrendingUp,
  Eye,
  BarChart3,
  RefreshCw,
  Trash2,
  Loader2,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Share2,
} from 'lucide-react';

interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  uniqueDays: number;
  todayViews: number;
  todayClicks: number;
  ctaBreakdown: { target: string; count: number }[];
  dailyViews: { date: string; views: number; clicks: number }[];
}

const CTA_LABELS: Record<string, string> = {
  whatsapp_header: 'زر واتساب - الرأس',
  whatsapp_header_mobile: 'زر واتساب - الجوال',
  whatsapp_hero: 'زر واتساب - الواجهة',
  whatsapp_about: 'زر واتساب - من نحن',
  whatsapp_contact: 'زر واتساب - تواصل معنا',
  whatsapp_footer: 'زر واتساب - التذييل',
  whatsapp_floating: 'الزر العائم - واتساب',
  'whatsapp_service_دهانات وديكورات حوائط': 'استفسار - دهانات حوائط',
  'whatsapp_service_لوحات وجداريات فنية': 'استفسار - أعمال فنية',
  social_instagram_url: 'انستغرام',
  social_facebook_url: 'فيسبوك',
  social_tiktok_url: 'تيك توك',
  social_snapchat_url: 'سناب شات',
  social_x_url: 'X (تويتر)',
  social_youtube_url: 'يوتيوب',
};

export function AdminAnalytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const loadAnalytics = useCallback(async () => {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    const events = data as { id: string; event_type: string; event_target: string | null; page_path: string | null; created_at: string }[];

    const totalViews = events.filter((e) => e.event_type === 'page_view').length;
    const totalClicks = events.filter((e) => e.event_type === 'cta_click').length;

    const today = new Date().toISOString().split('T')[0];
    const todayViews = events.filter((e) => e.event_type === 'page_view' && e.created_at.startsWith(today)).length;
    const todayClicks = events.filter((e) => e.event_type === 'cta_click' && e.created_at.startsWith(today)).length;

    // CTA breakdown
    const ctaCounts: Record<string, number> = {};
    events
      .filter((e) => e.event_type === 'cta_click')
      .forEach((e) => {
        const key = e.event_target ?? 'unknown';
        ctaCounts[key] = (ctaCounts[key] ?? 0) + 1;
      });
    const ctaBreakdown = Object.entries(ctaCounts)
      .map(([target, count]) => ({ target, count }))
      .sort((a, b) => b.count - a.count);

    // Daily views (last 14 days)
    const dailyMap: Record<string, { views: number; clicks: number }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      dailyMap[dateKey] = { views: 0, clicks: 0 };
    }
    events.forEach((e) => {
      const dateKey = e.created_at.split('T')[0];
      if (dailyMap[dateKey]) {
        if (e.event_type === 'page_view') dailyMap[dateKey].views++;
        else dailyMap[dateKey].clicks++;
      }
    });
    const dailyViews = Object.entries(dailyMap).map(([date, v]) => ({ date, ...v }));

    const uniqueDays = new Set(events.map((e) => e.created_at.split('T')[0])).size;

    setSummary({ totalViews, totalClicks, uniqueDays, todayViews, todayClicks, ctaBreakdown, dailyViews });
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const handleReset = async () => {
    setResetting(true);
    await supabase.from('analytics_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setResetting(false);
    setConfirmReset(false);
    loadAnalytics();
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    );
  }

  const maxDaily = Math.max(...(summary?.dailyViews.map((d) => Math.max(d.views, d.clicks)) ?? [1]), 1);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">الإحصائيات والزوار</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            متابعة زوار الموقع والتفاعل مع الأزرار والروابط
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-charcoal-700 shadow-sm ring-1 ring-charcoal-100 transition-all hover:bg-charcoal-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            تحديث
          </button>
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            تصفير
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Eye} label="إجمالي الزيارات" value={summary?.totalViews ?? 0} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={MousePointerClick} label="إجمالي النقرات" value={summary?.totalClicks ?? 0} color="text-gold-600" bg="bg-gold-50" />
        <StatCard icon={Users} label="زيارات اليوم" value={summary?.todayViews ?? 0} color="text-green-600" bg="bg-green-50" />
        <StatCard icon={TrendingUp} label="نقرات اليوم" value={summary?.todayClicks ?? 0} color="text-bronze-600" bg="bg-bronze-50" />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        {/* Daily chart */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-charcoal-100 lg:p-8">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-charcoal-400" />
            <h3 className="font-bold text-charcoal-900">آخر 14 يوماً</h3>
          </div>
          <div className="flex items-end justify-between gap-1.5 h-48">
            {summary?.dailyViews.map((day) => {
              const viewsHeight = (day.views / maxDaily) * 100;
              const clicksHeight = (day.clicks / maxDaily) * 100;
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full items-end justify-center gap-0.5 h-full">
                    <div
                      className="w-2.5 rounded-t bg-blue-400 transition-all hover:bg-blue-500"
                      style={{ height: `${Math.max(viewsHeight, 2)}%` }}
                      title={`${day.views} زيارة`}
                    />
                    <div
                      className="w-2.5 rounded-t bg-gold-400 transition-all hover:bg-gold-500"
                      style={{ height: `${Math.max(clicksHeight, 2)}%` }}
                      title={`${day.clicks} نقرة`}
                    />
                  </div>
                  <span className="text-[9px] text-charcoal-300">
                    {day.date.slice(5).replace('-', '/')}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-400" />
              <span className="text-xs text-charcoal-500">الزيارات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-gold-400" />
              <span className="text-xs text-charcoal-500">النقرات</span>
            </div>
          </div>
        </div>

        {/* CTA breakdown */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-charcoal-100 lg:p-8">
          <div className="mb-6 flex items-center gap-2">
            <MousePointerClick className="h-5 w-5 text-charcoal-400" />
            <h3 className="font-bold text-charcoal-900">توزيع النقرات على الأزرار</h3>
          </div>
          {summary && summary.ctaBreakdown.length > 0 ? (
            <div className="space-y-3">
              {summary.ctaBreakdown.map((cta) => {
                const maxCount = summary.ctaBreakdown[0].count;
                const percentage = (cta.count / maxCount) * 100;
                const label = CTA_LABELS[cta.target] ?? cta.target;
                return (
                  <div key={cta.target}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-charcoal-700">{label}</span>
                      <span className="font-bold text-charcoal-500">{cta.count}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-charcoal-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-gold-400 to-gold-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MousePointerClick className="h-10 w-10 text-charcoal-200" />
              <p className="mt-3 text-sm text-charcoal-400">لا توجد نقرات مسجلة بعد</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary info */}
      <div className="mt-6 rounded-2xl bg-charcoal-50 p-5">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2 text-charcoal-500">
            <CalendarIcon /> أيام نشطة: <span className="font-bold text-charcoal-700">{summary?.uniqueDays ?? 0}</span>
          </div>
          <div className="flex items-center gap-2 text-charcoal-500">
            <Share2 /> متوسط الزيارات اليومية:{' '}
            <span className="font-bold text-charcoal-700">
              {summary && summary.uniqueDays > 0 ? Math.round(summary.totalViews / summary.uniqueDays) : 0}
            </span>
          </div>
          <div className="flex items-center gap-2 text-charcoal-500">
            <MessageCircle className="h-4 w-4" /> نسبة التفاعل:{' '}
            <span className="font-bold text-charcoal-700">
              {summary && summary.totalViews > 0 ? ((summary.totalClicks / summary.totalViews) * 100).toFixed(1) : '0'}%
            </span>
          </div>
        </div>
      </div>

      {/* Reset confirmation */}
      {confirmReset && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => !resetting && setConfirmReset(false)}
        >
          <div
            className="mx-4 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <Trash2 className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-charcoal-900">تصفير الإحصائيات</h3>
            <p className="mt-2 text-charcoal-500">
              سيتم حذف جميع بيانات الزوار والنقرات نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {resetting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'نعم، تصفير الكل'}
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                disabled={resetting}
                className="flex-1 rounded-xl bg-charcoal-100 px-5 py-3 text-sm font-semibold text-charcoal-700 transition-colors hover:bg-charcoal-200"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-charcoal-100 transition-all hover:shadow-md">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="mt-3 text-2xl font-bold text-charcoal-900">{value.toLocaleString('ar-EG')}</p>
      <p className="mt-0.5 text-xs font-medium text-charcoal-500">{label}</p>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
