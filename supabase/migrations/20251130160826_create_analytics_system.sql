/*
  # Create Analytics System

  1. New Tables
    - `page_views`
      - `id` (uuid, primary key)
      - `session_id` (text) - Anonymous session identifier
      - `user_id` (text, nullable) - If user is identified
      - `page_path` (text) - Page URL path
      - `page_title` (text) - Page title
      - `referrer` (text, nullable) - Where visitor came from
      - `utm_source` (text, nullable) - Marketing source
      - `utm_medium` (text, nullable) - Marketing medium
      - `utm_campaign` (text, nullable) - Campaign name
      - `device_type` (text, nullable) - mobile/desktop/tablet
      - `browser` (text, nullable) - Browser name
      - `country` (text, nullable) - Visitor country
      - `duration` (integer, nullable) - Time spent on page in seconds
      - `created_at` (timestamptz)
    
    - `form_events`
      - `id` (uuid, primary key)
      - `session_id` (text) - Anonymous session identifier
      - `user_id` (text, nullable) - If user is identified
      - `form_type` (text) - quote/contact/newsletter
      - `event_type` (text) - view/start/submit/success/error
      - `page_path` (text) - Where form was viewed
      - `field_name` (text, nullable) - Field that triggered event
      - `error_message` (text, nullable) - Error if applicable
      - `metadata` (jsonb, nullable) - Additional data
      - `created_at` (timestamptz)
    
    - `conversion_events`
      - `id` (uuid, primary key)
      - `session_id` (text) - Anonymous session identifier
      - `user_id` (text, nullable) - If user is identified
      - `event_name` (text) - Event name (quote_submitted, contact_sent, etc)
      - `event_category` (text) - Category (conversion, engagement, etc)
      - `event_value` (numeric, nullable) - Optional value
      - `page_path` (text) - Where event occurred
      - `metadata` (jsonb, nullable) - Additional event data
      - `created_at` (timestamptz)
    
    - `analytics_sessions`
      - `id` (uuid, primary key)
      - `session_id` (text, unique) - Session identifier
      - `user_id` (text, nullable) - If user is identified
      - `first_visit` (timestamptz) - First page view
      - `last_visit` (timestamptz) - Last page view
      - `page_views` (integer) - Total page views
      - `referrer` (text, nullable) - Original referrer
      - `utm_source` (text, nullable) - Marketing source
      - `utm_medium` (text, nullable) - Marketing medium
      - `utm_campaign` (text, nullable) - Campaign name
      - `device_type` (text, nullable) - Device type
      - `converted` (boolean) - Whether session converted
      - `conversion_type` (text, nullable) - Type of conversion
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous insert (tracking)
    - Add policies for authenticated read (dashboard)

  3. Indexes
    - Add indexes for common queries
    - Optimize for analytics dashboard
*/

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id text,
  page_path text NOT NULL,
  page_title text NOT NULL,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text,
  browser text,
  country text,
  duration integer,
  created_at timestamptz DEFAULT now()
);

-- Create form_events table
CREATE TABLE IF NOT EXISTS form_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id text,
  form_type text NOT NULL,
  event_type text NOT NULL,
  page_path text NOT NULL,
  field_name text,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create conversion_events table
CREATE TABLE IF NOT EXISTS conversion_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id text,
  event_name text NOT NULL,
  event_category text NOT NULL,
  event_value numeric,
  page_path text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create analytics_sessions table
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  user_id text,
  first_visit timestamptz DEFAULT now(),
  last_visit timestamptz DEFAULT now(),
  page_views integer DEFAULT 1,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text,
  converted boolean DEFAULT false,
  conversion_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for page_views
CREATE POLICY "Anyone can insert page views"
  ON page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read page views"
  ON page_views FOR SELECT
  TO authenticated
  USING (true);

-- Policies for form_events
CREATE POLICY "Anyone can insert form events"
  ON form_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read form events"
  ON form_events FOR SELECT
  TO authenticated
  USING (true);

-- Policies for conversion_events
CREATE POLICY "Anyone can insert conversion events"
  ON conversion_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read conversion events"
  ON conversion_events FOR SELECT
  TO authenticated
  USING (true);

-- Policies for analytics_sessions
CREATE POLICY "Anyone can insert and update sessions"
  ON analytics_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own session"
  ON analytics_sessions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read sessions"
  ON analytics_sessions FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_utm_source ON page_views(utm_source);

CREATE INDEX IF NOT EXISTS idx_form_events_session_id ON form_events(session_id);
CREATE INDEX IF NOT EXISTS idx_form_events_form_type ON form_events(form_type);
CREATE INDEX IF NOT EXISTS idx_form_events_event_type ON form_events(event_type);
CREATE INDEX IF NOT EXISTS idx_form_events_created_at ON form_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversion_events_session_id ON conversion_events(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_event_name ON conversion_events(event_name);
CREATE INDEX IF NOT EXISTS idx_conversion_events_created_at ON conversion_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_converted ON analytics_sessions(converted);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_created_at ON analytics_sessions(created_at DESC);