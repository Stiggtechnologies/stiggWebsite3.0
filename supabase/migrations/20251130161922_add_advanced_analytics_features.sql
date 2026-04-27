/*
  # Add Advanced Analytics Features

  1. New Tables
    - `click_events`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `page_path` (text)
      - `element_selector` (text) - CSS selector of clicked element
      - `element_text` (text) - Text content of element
      - `x_position` (integer) - X coordinate
      - `y_position` (integer) - Y coordinate
      - `viewport_width` (integer)
      - `viewport_height` (integer)
      - `created_at` (timestamptz)
    
    - `scroll_events`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `page_path` (text)
      - `max_scroll_depth` (integer) - Percentage scrolled
      - `page_height` (integer)
      - `viewport_height` (integer)
      - `time_to_scroll` (integer) - Seconds to reach depth
      - `created_at` (timestamptz)
    
    - `session_recordings`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `page_path` (text)
      - `events` (jsonb) - Array of interaction events
      - `duration` (integer) - Recording duration in seconds
      - `created_at` (timestamptz)
    
    - `exit_pages`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `exit_page` (text)
      - `time_on_page` (integer) - Seconds spent on exit page
      - `total_session_duration` (integer)
      - `pages_visited` (integer)
      - `created_at` (timestamptz)
    
    - `geographic_data`
      - `id` (uuid, primary key)
      - `session_id` (text, unique)
      - `ip_address` (text) - Hashed for privacy
      - `country` (text)
      - `country_code` (text)
      - `region` (text)
      - `city` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `timezone` (text)
      - `created_at` (timestamptz)
    
    - `ab_tests`
      - `id` (uuid, primary key)
      - `test_name` (text)
      - `variant_name` (text)
      - `session_id` (text)
      - `converted` (boolean)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
    
    - `cohorts`
      - `id` (uuid, primary key)
      - `cohort_name` (text)
      - `session_id` (text)
      - `first_visit_date` (date)
      - `properties` (jsonb)
      - `created_at` (timestamptz)

  2. Enhancements to existing tables
    - Add columns to page_views for engagement metrics
    - Add columns to analytics_sessions for detailed tracking

  3. Security
    - Enable RLS on all new tables
    - Allow anonymous insert for tracking
    - Allow authenticated read for analytics

  4. Indexes
    - Optimize for analytics queries
*/

-- Create click_events table
CREATE TABLE IF NOT EXISTS click_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  page_path text NOT NULL,
  element_selector text,
  element_text text,
  x_position integer,
  y_position integer,
  viewport_width integer,
  viewport_height integer,
  created_at timestamptz DEFAULT now()
);

-- Create scroll_events table
CREATE TABLE IF NOT EXISTS scroll_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  page_path text NOT NULL,
  max_scroll_depth integer NOT NULL,
  page_height integer,
  viewport_height integer,
  time_to_scroll integer,
  created_at timestamptz DEFAULT now()
);

-- Create session_recordings table
CREATE TABLE IF NOT EXISTS session_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  page_path text NOT NULL,
  events jsonb DEFAULT '[]'::jsonb,
  duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create exit_pages table
CREATE TABLE IF NOT EXISTS exit_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  exit_page text NOT NULL,
  time_on_page integer,
  total_session_duration integer,
  pages_visited integer,
  created_at timestamptz DEFAULT now()
);

-- Create geographic_data table
CREATE TABLE IF NOT EXISTS geographic_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  ip_address text,
  country text,
  country_code text,
  region text,
  city text,
  latitude numeric,
  longitude numeric,
  timezone text,
  created_at timestamptz DEFAULT now()
);

-- Create ab_tests table
CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name text NOT NULL,
  variant_name text NOT NULL,
  session_id text NOT NULL,
  converted boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create cohorts table
CREATE TABLE IF NOT EXISTS cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_name text NOT NULL,
  session_id text NOT NULL,
  first_visit_date date NOT NULL,
  properties jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to page_views if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'page_views' AND column_name = 'time_on_page'
  ) THEN
    ALTER TABLE page_views ADD COLUMN time_on_page integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'page_views' AND column_name = 'scroll_depth'
  ) THEN
    ALTER TABLE page_views ADD COLUMN scroll_depth integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'page_views' AND column_name = 'clicks'
  ) THEN
    ALTER TABLE page_views ADD COLUMN clicks integer DEFAULT 0;
  END IF;
END $$;

-- Add new columns to analytics_sessions if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_sessions' AND column_name = 'bounce'
  ) THEN
    ALTER TABLE analytics_sessions ADD COLUMN bounce boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_sessions' AND column_name = 'session_duration'
  ) THEN
    ALTER TABLE analytics_sessions ADD COLUMN session_duration integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_sessions' AND column_name = 'exit_page'
  ) THEN
    ALTER TABLE analytics_sessions ADD COLUMN exit_page text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_sessions' AND column_name = 'total_clicks'
  ) THEN
    ALTER TABLE analytics_sessions ADD COLUMN total_clicks integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_sessions' AND column_name = 'avg_scroll_depth'
  ) THEN
    ALTER TABLE analytics_sessions ADD COLUMN avg_scroll_depth integer;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE scroll_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE exit_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;

-- Policies for click_events
CREATE POLICY "Anyone can insert click events"
  ON click_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read click events"
  ON click_events FOR SELECT
  TO authenticated
  USING (true);

-- Policies for scroll_events
CREATE POLICY "Anyone can insert scroll events"
  ON scroll_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read scroll events"
  ON scroll_events FOR SELECT
  TO authenticated
  USING (true);

-- Policies for session_recordings
CREATE POLICY "Anyone can insert session recordings"
  ON session_recordings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update session recordings"
  ON session_recordings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read session recordings"
  ON session_recordings FOR SELECT
  TO authenticated
  USING (true);

-- Policies for exit_pages
CREATE POLICY "Anyone can insert exit pages"
  ON exit_pages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read exit pages"
  ON exit_pages FOR SELECT
  TO authenticated
  USING (true);

-- Policies for geographic_data
CREATE POLICY "Anyone can insert geographic data"
  ON geographic_data FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read geographic data"
  ON geographic_data FOR SELECT
  TO authenticated
  USING (true);

-- Policies for ab_tests
CREATE POLICY "Anyone can insert ab test data"
  ON ab_tests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update ab test data"
  ON ab_tests FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read ab test data"
  ON ab_tests FOR SELECT
  TO authenticated
  USING (true);

-- Policies for cohorts
CREATE POLICY "Anyone can insert cohort data"
  ON cohorts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read cohort data"
  ON cohorts FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_click_events_session_id ON click_events(session_id);
CREATE INDEX IF NOT EXISTS idx_click_events_page_path ON click_events(page_path);
CREATE INDEX IF NOT EXISTS idx_click_events_created_at ON click_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scroll_events_session_id ON scroll_events(session_id);
CREATE INDEX IF NOT EXISTS idx_scroll_events_page_path ON scroll_events(page_path);
CREATE INDEX IF NOT EXISTS idx_scroll_events_created_at ON scroll_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_session_recordings_session_id ON session_recordings(session_id);
CREATE INDEX IF NOT EXISTS idx_session_recordings_created_at ON session_recordings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_exit_pages_session_id ON exit_pages(session_id);
CREATE INDEX IF NOT EXISTS idx_exit_pages_exit_page ON exit_pages(exit_page);
CREATE INDEX IF NOT EXISTS idx_exit_pages_created_at ON exit_pages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_geographic_data_session_id ON geographic_data(session_id);
CREATE INDEX IF NOT EXISTS idx_geographic_data_country ON geographic_data(country);
CREATE INDEX IF NOT EXISTS idx_geographic_data_city ON geographic_data(city);

CREATE INDEX IF NOT EXISTS idx_ab_tests_test_name ON ab_tests(test_name);
CREATE INDEX IF NOT EXISTS idx_ab_tests_session_id ON ab_tests(session_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_converted ON ab_tests(converted);

CREATE INDEX IF NOT EXISTS idx_cohorts_cohort_name ON cohorts(cohort_name);
CREATE INDEX IF NOT EXISTS idx_cohorts_first_visit_date ON cohorts(first_visit_date);