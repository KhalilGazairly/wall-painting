/*
# Create gallery_items and site_settings tables + storage bucket

1. New Tables
- `gallery_items`
  - `id` (uuid, primary key)
  - `title` (text, not null) — Arabic title of the work
  - `description` (text, nullable) — short Arabic description
  - `category` (text, not null) — 'wall_paint' or 'artwork'
  - `media_type` (text, not null) — 'photo' or 'video'
  - `media_url` (text, not null) — public URL of the uploaded file in Supabase Storage
  - `storage_path` (text, not null) — path within the storage bucket for deletion
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
- `site_settings`
  - `id` (int, primary key, always 1) — singleton row
  - `whatsapp_phone` (text, not null) — phone number for WhatsApp CTAs
  - `site_name` (text, not null) — business name shown in header/footer
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- gallery_items: public can read (anon + authenticated SELECT true); only authenticated admin can insert/update/delete.
- site_settings: public can read (anon + authenticated SELECT true); only authenticated admin can update.
- No public insert/update/delete on either table.

3. Storage
- Create a public bucket 'gallery-media' for storing images and videos.
- Allow public read; only authenticated can upload/delete.

4. Notes
- The admin dashboard uses Supabase Auth (email/password) so admin actions run as `authenticated`.
- The public website reads as `anon`, so SELECT policies must include `anon`.
*/

CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('wall_paint', 'artwork')),
  media_type text NOT NULL CHECK (media_type IN ('photo', 'video')),
  media_url text NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Public can read gallery items
DROP POLICY IF EXISTS "public_read_gallery" ON gallery_items;
CREATE POLICY "public_read_gallery"
  ON gallery_items FOR SELECT
  TO anon, authenticated USING (true);

-- Only authenticated admin can insert
DROP POLICY IF EXISTS "admin_insert_gallery" ON gallery_items;
CREATE POLICY "admin_insert_gallery"
  ON gallery_items FOR INSERT
  TO authenticated WITH CHECK (true);

-- Only authenticated admin can update
DROP POLICY IF EXISTS "admin_update_gallery" ON gallery_items;
CREATE POLICY "admin_update_gallery"
  ON gallery_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated admin can delete
DROP POLICY IF EXISTS "admin_delete_gallery" ON gallery_items;
CREATE POLICY "admin_delete_gallery"
  ON gallery_items FOR DELETE
  TO authenticated USING (true);

-- Site settings (singleton)
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  whatsapp_phone text NOT NULL DEFAULT '966500000000',
  site_name text NOT NULL DEFAULT 'الفرسان للدهانات',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
DROP POLICY IF EXISTS "public_read_settings" ON site_settings;
CREATE POLICY "public_read_settings"
  ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

-- Only authenticated admin can update settings
DROP POLICY IF EXISTS "admin_update_settings" ON site_settings;
CREATE POLICY "admin_update_settings"
  ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated admin can insert settings (in case singleton doesn't exist yet)
DROP POLICY IF EXISTS "admin_insert_settings" ON site_settings;
CREATE POLICY "admin_insert_settings"
  ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

-- Seed the singleton settings row
INSERT INTO site_settings (id, whatsapp_phone, site_name)
VALUES (1, '966500000000', 'الفرسان للدهانات')
ON CONFLICT (id) DO NOTHING;

-- Create the storage bucket for gallery media (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-media', 'gallery-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated upload/delete
DROP POLICY IF EXISTS "public_read_storage" ON storage.objects;
CREATE POLICY "public_read_storage"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery-media');

DROP POLICY IF EXISTS "admin_upload_storage" ON storage.objects;
CREATE POLICY "admin_upload_storage"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery-media');

DROP POLICY IF EXISTS "admin_delete_storage" ON storage.objects;
CREATE POLICY "admin_delete_storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery-media');

DROP POLICY IF EXISTS "admin_update_storage" ON storage.objects;
CREATE POLICY "admin_update_storage"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery-media');
