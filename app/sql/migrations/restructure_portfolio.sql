-- Restructure portfolio system: Remove complex tables and create simple artist_portfolio

-- Step 1: Drop existing complex tables
DROP TABLE IF EXISTS commission_portfolio CASCADE;
DROP TABLE IF EXISTS portfolio_item CASCADE;

-- Step 2: Create new artist_portfolio table (one per artist)
CREATE TABLE artist_portfolio (
    artist_id uuid PRIMARY KEY REFERENCES profiles(profile_id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    images jsonb NOT NULL DEFAULT '[]'::jsonb,
    category text,
    tags jsonb NOT NULL DEFAULT '[]'::jsonb,
    views_count integer NOT NULL DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

-- Step 3: Remove portfolio_image_ids column from commission if it exists
ALTER TABLE commission DROP COLUMN IF EXISTS portfolio_image_ids; 