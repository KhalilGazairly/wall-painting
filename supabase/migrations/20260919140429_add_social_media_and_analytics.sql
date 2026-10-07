/*
# Add social media columns + analytics table

1. Modified Tables
- `site_settings`
  - Added `instagram_url` (text, nullable) — Instagram profile link
  - Added `facebook_url` (text, nullable) — Facebook page link
  - Added `tiktok_url` (text, nullable) — TikTok profile link
  - Added `snapchat_url` (text, nullable) — Snapchat profile link
  - Added `x_url` (text, nullable) — X/Twitter profile link
  - Added `youtube_url` (text, nullable) — YouTube channel link

2. New Tables
- `analytics_events`
  - `id` (uuid, primary key)
  - `event_type` (text, not null) — 'page_view' or 'cta_click'
  - `event_target` (text, nullable) — which CTA was clicked (e.g. 'whatsapp_header', 'whatsapp_float', 'whatsapp_contact', 'whatsapp_service')
  - `page_path` (text, nullable) — the page path viewed
  - `created_at` (timestamptz, default now())

3. Security
- Enable RLS on `analytics_events`.
- Public (anon + authenticated) can INSERT events — visitors need to record their visits/clicks.
- Only authenticated admin can SELECT events — stats are private to the dashboard.
- No public SELECT, UPDATE, or DELETE on analytics_events.

4. Notes
- Social media columns are nullable so existing settings row remains valid.
- Analytics inserts are fire-and-forget from the public site; no sensitive data is stored.
*/

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS facebook_url text,
  ADD COLUMN IF NOT EXISTS tiktok_url text,
  ADD COLUMN IF NOT EXISTS snapchat_url text,
  ADD COLUMN IF NOT EXISTS x_url text,
  ADD COLUMN IF NOT EXISTS youtube_url text;

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('page_view', 'cta_click')),
  event_target text,
  page_path text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public can insert analytics events (fire-and-forget tracking)
DROP POLICY IF EXISTS "public_insert_analytics" ON analytics_events;
CREATE POLICY "public_insert_analytics"
  ON analytics_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated admin can read analytics
DROP POLICY IF EXISTS "admin_read_analytics" ON analytics_events;
CREATE POLICY "admin_read_analytics"
  ON analytics_events FOR SELECT
  TO authenticated USING (true);

-- Only authenticated admin can delete analytics (for cleanup/reset)
DROP POLICY IF EXISTS "admin_delete_analytics" ON analytics_events;
CREATE POLICY "admin_delete_analytics"
  ON analytics_events FOR DELETE
  TO authenticated USING (true);

-- Index for efficient date-based queries
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events (event_type);
