/*
  # Create fields table for crop management

  1. New Tables
    - `fields`
      - `id` (uuid, primary key) - Unique identifier for each field
      - `user_id` (uuid) - Owner of the field (for future auth)
      - `name` (text) - Name of the field
      - `crop_type` (text) - Type of crop to plant
      - `location` (jsonb) - Polygon coordinates defining field boundaries
      - `center_lat` (decimal) - Latitude of field center for weather data
      - `center_lng` (decimal) - Longitude of field center for weather data
      - `recommendations` (jsonb) - Stored planting recommendations and climate data
      - `created_at` (timestamptz) - When the field was created
      - `updated_at` (timestamptz) - When the field was last updated

  2. Security
    - Enable RLS on `fields` table
    - Add policy for public access (temporary, for development)
    
  3. Notes
    - The location field stores GeoJSON polygon data
    - Recommendations field stores climate analysis and optimal planting periods
    - Fields can be searched and filtered by crop type
*/

CREATE TABLE IF NOT EXISTS fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  crop_type text NOT NULL,
  location jsonb NOT NULL,
  center_lat decimal(10, 6) NOT NULL,
  center_lng decimal(10, 6) NOT NULL,
  recommendations jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to fields"
  ON fields
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to fields"
  ON fields
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to fields"
  ON fields
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to fields"
  ON fields
  FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_fields_crop_type ON fields(crop_type);
CREATE INDEX IF NOT EXISTS idx_fields_created_at ON fields(created_at DESC);