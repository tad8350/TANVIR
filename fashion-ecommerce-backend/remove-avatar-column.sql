-- Remove avatar_url column from admin_profiles table
ALTER TABLE admin_profiles DROP COLUMN IF EXISTS avatar_url;
