-- Leads, Contacts & CRM System
-- Creates tables for managing leads, contact forms, quotes, newsletter signups, and AI automation

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  source text DEFAULT 'contact',
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quote_requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  service_type text NOT NULL,
  property_type text,
  security_concerns text,
  budget text,
  timeline text,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'won', 'lost')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  company text,
  phone text,
  source text NOT NULL,
  score integer DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  priority text DEFAULT 'cold' CHECK (priority IN ('hot', 'warm', 'cold')),
  stage text DEFAULT 'awareness' CHECK (stage IN ('awareness', 'consideration', 'decision', 'customer')),
  interests text[] DEFAULT '{}',
  behavior jsonb DEFAULT '{}',
  demographics jsonb DEFAULT '{}',
  touchpoints jsonb[] DEFAULT '{}',
  last_activity timestamptz DEFAULT now(),
  assigned_to text,
  automation_enabled boolean DEFAULT true,
  human_override boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  interests text[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- Create ai_chat_sessions table
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id text NOT NULL,
  messages jsonb[] DEFAULT '{}',
  lead_score integer DEFAULT 0,
  service_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_submissions
CREATE POLICY "Public can insert contact submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for quote_requests
CREATE POLICY "Public can insert quote requests"
  ON quote_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all quote requests"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update quote requests"
  ON quote_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for leads
CREATE POLICY "Authenticated users can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for newsletter_subscribers
CREATE POLICY "Public can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update subscribers"
  ON newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ai_chat_sessions
CREATE POLICY "Authenticated users can view all chat sessions"
  ON ai_chat_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert chat sessions"
  ON ai_chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update chat sessions"
  ON ai_chat_sessions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_priority ON quote_requests(priority);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created ON quote_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_last_activity ON leads(last_activity DESC);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

CREATE INDEX IF NOT EXISTS idx_chat_session_id ON ai_chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON ai_chat_sessions(created_at DESC);

-- Trigger to update updated_at on contact_submissions
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on quote_requests
DROP TRIGGER IF EXISTS update_quote_requests_updated_at ON quote_requests;
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on leads
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on ai_chat_sessions
DROP TRIGGER IF EXISTS update_ai_chat_sessions_updated_at ON ai_chat_sessions;
CREATE TRIGGER update_ai_chat_sessions_updated_at
  BEFORE UPDATE ON ai_chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();