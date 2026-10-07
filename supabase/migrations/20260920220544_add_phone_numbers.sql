/*
# Add phone number columns to site_settings

1. Modified Tables
- `site_settings`
  - Added `phone_1` (text, nullable) — Primary phone number for direct calls
  - Added `phone_2` (text, nullable) — Secondary phone number for direct calls

2. Notes
- Both columns are nullable so the existing settings row remains valid.
- These are display/dial numbers (e.g. "01069949029"), not necessarily the WhatsApp number.
- The admin can set them from the Settings page; they appear in the Contact section.
*/

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS phone_1 text,
  ADD COLUMN IF NOT EXISTS phone_2 text;

-- Populate with the requested numbers
UPDATE site_settings
  SET phone_1 = '01069949029', phone_2 = '01228992877'
  WHERE id = 1 AND phone_1 IS NULL;
