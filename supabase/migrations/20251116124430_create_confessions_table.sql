/*
  # Create confessions table for Anonymous confession board

  1. New Tables
    - `confessions`
      - `id` (uuid, primary key)
      - `text` (text, the confession content)
      - `category` (text, optional category/tag for confession)
      - `created_at` (timestamp)
      - `likes_count` (integer, count of likes/reactions)

  2. Security
    - Enable RLS on `confessions` table
    - Allow anyone to read confessions (public)
    - Allow anyone to insert confessions (anonymous submission)
    - Prevent updates and deletes (immutable once posted)
*/

CREATE TABLE IF NOT EXISTS confessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  category text DEFAULT 'General',
  created_at timestamptz DEFAULT now(),
  likes_count integer DEFAULT 0
);

ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view confessions"
  ON confessions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can submit confessions"
  ON confessions
  FOR INSERT
  WITH CHECK (true);
