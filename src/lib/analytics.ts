import { supabase } from '@/lib/supabase';

export type AnalyticsEventType = 'page_view' | 'cta_click';

export async function trackEvent(
  eventType: AnalyticsEventType,
  eventTarget?: string,
  pagePath?: string,
): Promise<void> {
  try {
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      event_target: eventTarget ?? null,
      page_path: pagePath ?? window.location.pathname,
    });
  } catch {
    // Silently fail — analytics should never break the user experience
  }
}

export function trackPageView(): void {
  void trackEvent('page_view', undefined, window.location.pathname);
}

export function trackCTAClick(target: string): void {
  void trackEvent('cta_click', target, window.location.pathname);
}
