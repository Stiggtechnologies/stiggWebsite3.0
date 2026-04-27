-- Add automation tracking fields to tables

-- Add SLA tracking to quote_requests
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS sla_deadline timestamptz;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS sla_met boolean DEFAULT null;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS response_sent_at timestamptz;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS notifications_sent jsonb DEFAULT '[]';

-- Add newsletter tracking to newsletter_subscribers
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS last_sent_at timestamptz;
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS open_count integer DEFAULT 0;
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS click_count integer DEFAULT 0;

-- Create newsletter_campaigns table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  html_content text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  recipient_count integer DEFAULT 0,
  open_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  created_by text
);

-- Create notifications table for tracking all notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('email', 'sms', 'slack', 'webhook')),
  recipient text NOT NULL,
  subject text,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sent_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for newsletter_campaigns
CREATE POLICY "Authenticated users can manage campaigns"
  ON newsletter_campaigns FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for notifications
CREATE POLICY "Authenticated users can view notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to calculate SLA deadline (2 hours from creation)
CREATE OR REPLACE FUNCTION set_quote_sla_deadline()
RETURNS TRIGGER AS $$
BEGIN
  NEW.sla_deadline = NEW.created_at + INTERVAL '2 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set SLA deadline on quote creation
DROP TRIGGER IF EXISTS set_sla_deadline_trigger ON quote_requests;
CREATE TRIGGER set_sla_deadline_trigger
  BEFORE INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_quote_sla_deadline();

-- Function to get overdue quotes
CREATE OR REPLACE FUNCTION get_overdue_quotes()
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  email text,
  phone text,
  service_type text,
  priority text,
  created_at timestamptz,
  sla_deadline timestamptz,
  hours_overdue numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    q.id,
    q.first_name,
    q.last_name,
    q.email,
    q.phone,
    q.service_type,
    q.priority,
    q.created_at,
    q.sla_deadline,
    EXTRACT(EPOCH FROM (now() - q.sla_deadline)) / 3600 as hours_overdue
  FROM quote_requests q
  WHERE q.status IN ('pending', 'reviewed')
    AND q.sla_deadline < now()
    AND q.response_sent_at IS NULL
  ORDER BY q.sla_deadline ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get hot leads needing immediate attention
CREATE OR REPLACE FUNCTION get_hot_leads()
RETURNS TABLE (
  id uuid,
  email text,
  name text,
  company text,
  phone text,
  score integer,
  priority text,
  stage text,
  interests text[],
  last_activity timestamptz,
  assigned_to text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.email,
    l.name,
    l.company,
    l.phone,
    l.score,
    l.priority,
    l.stage,
    l.interests,
    l.last_activity,
    l.assigned_to
  FROM leads l
  WHERE l.priority = 'hot'
    AND l.human_override = false
    AND l.stage != 'customer'
  ORDER BY l.score DESC, l.last_activity DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark quote as responded
CREATE OR REPLACE FUNCTION mark_quote_responded(quote_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE quote_requests
  SET 
    response_sent_at = now(),
    sla_met = (now() <= sla_deadline),
    updated_at = now()
  WHERE id = quote_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quote_sla_deadline ON quote_requests(sla_deadline) WHERE status IN ('pending', 'reviewed');
CREATE INDEX IF NOT EXISTS idx_leads_hot ON leads(priority, score DESC) WHERE priority = 'hot';
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status, created_at DESC);