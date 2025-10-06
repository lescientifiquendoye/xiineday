/*
  # Create subscriptions table for Pro version

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key) - Unique identifier for each subscription
      - `user_id` (uuid) - Owner of the subscription (for future auth)
      - `plan_name` (text) - Name of the subscription plan (Free, Pro, Premium)
      - `status` (text) - Current status (active, cancelled, expired)
      - `start_date` (timestamptz) - When the subscription started
      - `end_date` (timestamptz) - When the subscription ends
      - `price` (decimal) - Price paid for the subscription
      - `features` (jsonb) - JSON object containing plan features
      - `created_at` (timestamptz) - When the subscription was created
      - `updated_at` (timestamptz) - When the subscription was last updated

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policies for public access (temporary, for development)
    
  3. Notes
    - Free plan has basic features
    - Pro plan includes advanced weather, multiple fields, priority support
    - Premium plan includes all features plus AI recommendations
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  plan_name text NOT NULL DEFAULT 'Free',
  status text NOT NULL DEFAULT 'active',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  price decimal(10, 2) DEFAULT 0,
  features jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to subscriptions"
  ON subscriptions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to subscriptions"
  ON subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to subscriptions"
  ON subscriptions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to subscriptions"
  ON subscriptions
  FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_name ON subscriptions(plan_name);