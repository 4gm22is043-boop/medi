import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  full_name: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  emergency_contact?: string;
  blood_type?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  created_at: string;
  updated_at: string;
}

export interface HealthRecord {
  id: string;
  user_id: string;
  heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  temperature?: number;
  oxygen_level?: number;
  glucose?: number;
  weight?: number;
  notes?: string;
  recorded_at: string;
  created_at: string;
}

export interface DiseaseAssessment {
  id: string;
  user_id: string;
  symptoms: string[];
  detected_diseases: any;
  recommendations?: string;
  severity: string;
  created_at: string;
}

export interface RiskAssessment {
  id: string;
  user_id: string;
  medical_history: any;
  lifestyle_data: any;
  current_vitals: any;
  risk_score: number;
  risk_level: string;
  ai_analysis?: string;
  recommendations?: string[];
  created_at: string;
}
