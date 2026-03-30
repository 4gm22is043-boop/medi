/*
  # Healthcare Platform Database Schema

  ## Overview
  This migration sets up the complete database schema for the AI-powered healthcare platform,
  including user profiles, health records, and AI assessments.

  ## New Tables
  
  ### 1. `user_profiles`
  Extended user information beyond authentication
  - `id` (uuid, primary key) - Links to auth.users
  - `full_name` (text) - User's full name
  - `date_of_birth` (date) - For age calculations
  - `gender` (text) - Male/Female/Other
  - `phone` (text) - Contact number
  - `emergency_contact` (text) - Emergency contact info
  - `blood_type` (text) - A+, B+, O+, etc.
  - `allergies` (text[]) - List of known allergies
  - `chronic_conditions` (text[]) - Existing conditions
  - `created_at` (timestamptz) - Profile creation time
  - `updated_at` (timestamptz) - Last update time

  ### 2. `health_records`
  Daily health vitals and measurements
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Links to auth.users
  - `heart_rate` (integer) - BPM
  - `blood_pressure_systolic` (integer) - mmHg
  - `blood_pressure_diastolic` (integer) - mmHg
  - `temperature` (decimal) - Celsius
  - `oxygen_level` (integer) - SpO2 percentage
  - `glucose` (integer) - mg/dL
  - `weight` (decimal) - kg
  - `notes` (text) - Optional notes
  - `recorded_at` (timestamptz) - When measurement was taken
  - `created_at` (timestamptz) - Record creation time

  ### 3. `disease_assessments`
  AI-powered disease detection results
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Links to auth.users
  - `symptoms` (text[]) - List of reported symptoms
  - `detected_diseases` (jsonb) - AI results with confidence levels
  - `recommendations` (text) - AI-generated advice
  - `severity` (text) - Low/Medium/High
  - `created_at` (timestamptz) - Assessment time

  ### 4. `risk_assessments`
  Comprehensive health risk analysis
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Links to auth.users
  - `medical_history` (jsonb) - Past conditions, surgeries, etc.
  - `lifestyle_data` (jsonb) - Exercise, diet, smoking, alcohol, etc.
  - `current_vitals` (jsonb) - Latest health measurements
  - `risk_score` (integer) - 0-100 score
  - `risk_level` (text) - Low/Medium/High
  - `ai_analysis` (text) - Detailed AI explanation
  - `recommendations` (text[]) - Actionable advice
  - `created_at` (timestamptz) - Assessment time

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - All policies check authentication and ownership
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  date_of_birth date,
  gender text,
  phone text,
  emergency_contact text,
  blood_type text,
  allergies text[] DEFAULT '{}',
  chronic_conditions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  heart_rate integer,
  blood_pressure_systolic integer,
  blood_pressure_diastolic integer,
  temperature decimal(4,1),
  oxygen_level integer,
  glucose integer,
  weight decimal(5,1),
  notes text,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create disease_assessments table
CREATE TABLE IF NOT EXISTS disease_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symptoms text[] NOT NULL,
  detected_diseases jsonb DEFAULT '[]',
  recommendations text,
  severity text DEFAULT 'Low',
  created_at timestamptz DEFAULT now()
);

-- Create risk_assessments table
CREATE TABLE IF NOT EXISTS risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medical_history jsonb DEFAULT '{}',
  lifestyle_data jsonb DEFAULT '{}',
  current_vitals jsonb DEFAULT '{}',
  risk_score integer DEFAULT 0,
  risk_level text DEFAULT 'Low',
  ai_analysis text,
  recommendations text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS health_records_user_id_idx ON health_records(user_id);
CREATE INDEX IF NOT EXISTS health_records_recorded_at_idx ON health_records(recorded_at DESC);
CREATE INDEX IF NOT EXISTS disease_assessments_user_id_idx ON disease_assessments(user_id);
CREATE INDEX IF NOT EXISTS disease_assessments_created_at_idx ON disease_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS risk_assessments_user_id_idx ON risk_assessments(user_id);
CREATE INDEX IF NOT EXISTS risk_assessments_created_at_idx ON risk_assessments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for health_records
CREATE POLICY "Users can view own health records"
  ON health_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health records"
  ON health_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health records"
  ON health_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health records"
  ON health_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for disease_assessments
CREATE POLICY "Users can view own disease assessments"
  ON disease_assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disease assessments"
  ON disease_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own disease assessments"
  ON disease_assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for risk_assessments
CREATE POLICY "Users can view own risk assessments"
  ON risk_assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own risk assessments"
  ON risk_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own risk assessments"
  ON risk_assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();