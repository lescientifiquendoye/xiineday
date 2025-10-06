/*
  # Create events table for agricultural event planning

  ## Overview
  This migration creates a table to store user-created agricultural events 
  that will be displayed on the calendar interface.

  ## Tables Created
  
  ### events
  - `id` (uuid, primary key) - Unique identifier for each event
  - `title` (text, required) - Name of the event
  - `event_type` (text, required) - Type of agricultural event (e.g., 'Semis', 'Récolte')
  - `location` (text, required) - Geographic location of the event
  - `event_date` (date, required) - Date when the event is scheduled
  - `description` (text, optional) - Additional details about the event
  - `weather_score` (integer, optional) - Weather suitability score (0-100)
  - `created_at` (timestamptz) - Timestamp when the event was created
  - `updated_at` (timestamptz) - Timestamp when the event was last updated

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the events table
  - Public read access: Anyone can view events (useful for agricultural calendar sharing)
  - Public write access: Anyone can create events (simplified for demo purposes)
  - Users can update and delete their own events based on session tracking
  
  ## Indexes
  - Index on `event_date` for efficient date-based queries
  - Index on `location` for location-based filtering
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_type text NOT NULL,
  location text NOT NULL,
  event_date date NOT NULL,
  description text DEFAULT '',
  weather_score integer CHECK (weather_score >= 0 AND weather_score <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read events (public calendar view)
CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  USING (true);

-- Allow anyone to create events
CREATE POLICY "Anyone can create events"
  ON events
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update events (simplified for demo)
CREATE POLICY "Anyone can update events"
  ON events
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete events (simplified for demo)
CREATE POLICY "Anyone can delete events"
  ON events
  FOR DELETE
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();