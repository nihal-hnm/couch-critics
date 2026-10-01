-- =============================================================================
-- Cinema Journal — Complete SQL Schema Migration
-- =============================================================================
-- Run this entire script in Supabase's SQL Editor (Dashboard → SQL Editor).
-- It is idempotent: safe to run multiple times.
--
-- Domain Model:
--   profiles  ←── auth.users (1:1)
--   entries   ←── profiles  (1:N)  — movie journal entries (watching/toWatch/watched)
--   reviews   ←── entries   (1:1)  — user reviews for "watched" entries
--   attachments ← entries   (1:N)  — file references in Supabase Storage
-- =============================================================================

-- ─── 0. Helper: auto-update `updated_at` trigger ────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── 1. Profiles ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE,
  display_name TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── 2. Entries (the core journal items) ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.entries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shelf         TEXT NOT NULL CHECK (shelf IN ('watching', 'toWatch', 'watched')),

  -- TMDB snapshot (denormalized for offline / fast reads)
  tmdb_id       INTEGER NOT NULL,
  title         TEXT NOT NULL,
  poster_url    TEXT,
  release_year  TEXT,
  runtime       INTEGER NOT NULL DEFAULT 0,
  genres        TEXT[] NOT NULL DEFAULT '{}',
  director      TEXT NOT NULL DEFAULT '',
  overview      TEXT NOT NULL DEFAULT '',
  media_type    TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')) DEFAULT 'movie',

  -- Progress tracking (nullable — only relevant for "watching" shelf)
  current_episode  INTEGER,
  total_episodes   INTEGER,
  minutes_watched  INTEGER,
  total_minutes    INTEGER,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate TMDB items per user
  UNIQUE (user_id, tmdb_id)
);

CREATE INDEX IF NOT EXISTS idx_entries_user_id ON public.entries (user_id);
CREATE INDEX IF NOT EXISTS idx_entries_shelf ON public.entries (user_id, shelf);

DROP TRIGGER IF EXISTS entries_updated_at ON public.entries;
CREATE TRIGGER entries_updated_at
  BEFORE UPDATE ON public.entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── 3. Reviews (1:1 with entries, only for "watched" shelf) ────────────────

CREATE TABLE IF NOT EXISTS public.reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id        UUID NOT NULL UNIQUE REFERENCES public.entries(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating          SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 10),
  notes           TEXT NOT NULL DEFAULT '',
  tags            TEXT[] NOT NULL DEFAULT '{}',
  date_completed  DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_entry_id ON public.reviews (entry_id);

DROP TRIGGER IF EXISTS reviews_updated_at ON public.reviews;
CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── 4. Attachments (file references stored in Supabase Storage) ────────────

CREATE TABLE IF NOT EXISTS public.attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id    UUID NOT NULL REFERENCES public.entries(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bucket      TEXT NOT NULL DEFAULT 'attachments',
  storage_path TEXT NOT NULL,
  file_name   TEXT NOT NULL,
  content_type TEXT,
  size_bytes  BIGINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attachments_entry_id ON public.attachments (entry_id);

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================

-- ─── Profiles RLS ───────────────────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles: users can view any profile" ON public.profiles;
CREATE POLICY "Profiles: users can view any profile"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Profiles: users can update own profile" ON public.profiles;
CREATE POLICY "Profiles: users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── Entries RLS ────────────────────────────────────────────────────────────

ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Entries: users can view own entries" ON public.entries;
CREATE POLICY "Entries: users can view own entries"
  ON public.entries FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Entries: users can insert own entries" ON public.entries;
CREATE POLICY "Entries: users can insert own entries"
  ON public.entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Entries: users can update own entries" ON public.entries;
CREATE POLICY "Entries: users can update own entries"
  ON public.entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Entries: users can delete own entries" ON public.entries;
CREATE POLICY "Entries: users can delete own entries"
  ON public.entries FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Reviews RLS ────────────────────────────────────────────────────────────

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews: users can view own reviews" ON public.reviews;
CREATE POLICY "Reviews: users can view own reviews"
  ON public.reviews FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Reviews: users can insert own reviews" ON public.reviews;
CREATE POLICY "Reviews: users can insert own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Reviews: users can update own reviews" ON public.reviews;
CREATE POLICY "Reviews: users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Reviews: users can delete own reviews" ON public.reviews;
CREATE POLICY "Reviews: users can delete own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Attachments RLS ────────────────────────────────────────────────────────

ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Attachments: users can view own attachments" ON public.attachments;
CREATE POLICY "Attachments: users can view own attachments"
  ON public.attachments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Attachments: users can insert own attachments" ON public.attachments;
CREATE POLICY "Attachments: users can insert own attachments"
  ON public.attachments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Attachments: users can delete own attachments" ON public.attachments;
CREATE POLICY "Attachments: users can delete own attachments"
  ON public.attachments FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- Supabase Storage Bucket & Policies
-- =============================================================================
-- NOTE: Create the bucket via Supabase Dashboard (Storage → New Bucket)
-- Name: "attachments", Private (not public).
-- Then run these policies:

-- Allow authenticated users to upload files under their own folder
DROP POLICY IF EXISTS "Attachments bucket: owner upload" ON storage.objects;
CREATE POLICY "Attachments bucket: owner upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to read their own files
DROP POLICY IF EXISTS "Attachments bucket: owner read" ON storage.objects;
CREATE POLICY "Attachments bucket: owner read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own files
DROP POLICY IF EXISTS "Attachments bucket: owner delete" ON storage.objects;
CREATE POLICY "Attachments bucket: owner delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to update/overwrite their own files
DROP POLICY IF EXISTS "Attachments bucket: owner update" ON storage.objects;
CREATE POLICY "Attachments bucket: owner update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
