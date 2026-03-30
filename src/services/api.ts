import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const healthRecordsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(record: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('health_records')
      .insert([{ ...record, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, record: any) {
    const { data, error } = await supabase
      .from('health_records')
      .update(record)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getRecent(limit: number = 7) {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
};

export const diseaseDetectionAPI = {
  async detect(symptoms: string[]) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${SUPABASE_URL}/functions/v1/disease-detection`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to detect diseases');
    }

    const result = await response.json();
    return result.data;
  },

  async saveAssessment(symptoms: string[], result: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('disease_assessments')
      .insert([{
        user_id: user.id,
        symptoms,
        detected_diseases: result.diseases || [],
        recommendations: result.recommendations,
        severity: result.severity || 'Medium'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getHistory() {
    const { data, error } = await supabase
      .from('disease_assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

export const riskAssessmentAPI = {
  async assess(assessmentData: any) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${SUPABASE_URL}/functions/v1/risk-assessment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to assess risk');
    }

    const result = await response.json();
    return result.data;
  },

  async saveAssessment(assessmentData: any, result: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('risk_assessments')
      .insert([{
        user_id: user.id,
        medical_history: assessmentData.medicalHistory,
        lifestyle_data: assessmentData.lifestyle,
        current_vitals: assessmentData.vitals,
        risk_score: result.riskScore,
        risk_level: result.riskLevel,
        ai_analysis: result.analysis,
        recommendations: result.recommendations
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getHistory() {
    const { data, error } = await supabase
      .from('risk_assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
