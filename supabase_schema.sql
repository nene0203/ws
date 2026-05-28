-- SQL Schema for Supabase Persistence
-- Run this script in your Supabase SQL Editor to set up the posts collection

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1,
  news_url TEXT NOT NULL DEFAULT '',
  manchete VARCHAR(100) NOT NULL DEFAULT '',
  subtitulo VARCHAR(120) NOT NULL DEFAULT '',
  legenda TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  pub_type TEXT NOT NULL DEFAULT '1080x1440',
  tone TEXT NOT NULL DEFAULT 'Informativo',
  quality TEXT NOT NULL DEFAULT '1080p',
  text_styles JSONB NOT NULL DEFAULT '{}'::jsonb,
  preview_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  instagram_connected BOOLEAN NOT NULL DEFAULT true,
  whatsapp_connected BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS) rules
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create and manage their own posts" 
ON public.posts 
FOR ALL 
USING (true)
WITH CHECK (true);
