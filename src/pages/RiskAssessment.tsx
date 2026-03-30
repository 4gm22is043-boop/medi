import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Loader, Activity } from 'lucide-react';
import { riskAssessmentAPI } from '../services/api';

interface FormData {
  medicalHistory: {
    pastConditions: string[];
    surgeries: string[];
    familyHistory: string[];
    medications: string[];
  };
  lifestyle: {
    exercise: string;
    diet: string;
    smoking: boolean;
    alcohol: string;
    sleepHours: number;
    stressLevel: string;
  };
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenLevel: number;
    glucose: number;
    weight: number;
    bmi: number;
  };
  demographics: {
    age: number;
    gender: string;
  };
}

interface RiskResult {
  riskScore: number;
  riskLevel: string;
  analysis: string;
  concerns: string[];
  recommendations: string[];
}

export default function RiskAssessment() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    medicalHistory: {
      pastConditions: [],
      surgeries: [],
      familyHistory: [],
      medications: []
    },
    lifestyle: {
      exercise: 'moderate',
      diet: 'balanced',
      smoking: false,
      alcohol: 'none',
      sleepHours: 7,
      stressLevel: 'moderate'
    },
    vitals: {
      heartRate: 70,
      bloodPressure: '120/80',
      temperature: 36.6,
      oxygenLevel: 98,
      glucose: 90,
      weight: 70,
      bmi: 22
    },
    demographics: {
      age: 30,
      gender: 'male'
    }
  });

  const handleArrayInput = (category: keyof FormData, field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: items
      }
    }));
  };

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await riskAssessmentAPI.assess(formData);
      setResult(data);
      await riskAssessmentAPI.saveAssessment(formData, data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to assess risk. Please ensure you have configured the Groq API key for the edge function.';
      setError(errorMsg);
      console.error('Error assessing risk:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'from-red-500 to-rose-600';
      case 'medium': return 'from-amber-500 to-orange-600';
      default: return 'from-emerald-500 to-teal-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-semibold">Comprehensive Health Assessment</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            Risk <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Assessment</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Complete your health profile for an AI-powered risk analysis
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 shadow-lg flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Error</h3>
                <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
              </div>
            </motion.div>
          )}
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 space-y-8 max-h-[700px] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      s <= step
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {s}
                    </div>
                    {s < 4 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Demographics</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age</label>
                      <input
                        type="number"
                        value={formData.demographics.age}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          demographics: { ...prev.demographics, age: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                      <select
                        value={formData.demographics.gender}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          demographics: { ...prev.demographics, gender: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical History</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Past Conditions (comma-separated)</label>
                      <input
                        type="text"
                        onChange={(e) => handleArrayInput('medicalHistory', 'pastConditions', e.target.value)}
                        placeholder="Diabetes, Hypertension, etc."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Surgeries (comma-separated)</label>
                      <input
                        type="text"
                        onChange={(e) => handleArrayInput('medicalHistory', 'surgeries', e.target.value)}
                        placeholder="Appendectomy, etc."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Family History (comma-separated)</label>
                      <input
                        type="text"
                        onChange={(e) => handleArrayInput('medicalHistory', 'familyHistory', e.target.value)}
                        placeholder="Heart disease, Cancer, etc."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lifestyle</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exercise Level</label>
                      <select
                        value={formData.lifestyle.exercise}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, exercise: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="none">None</option>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="intense">Intense</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diet Quality</label>
                      <select
                        value={formData.lifestyle.diet}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, diet: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="poor">Poor</option>
                        <option value="balanced">Balanced</option>
                        <option value="excellent">Excellent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sleep Hours</label>
                      <input
                        type="number"
                        value={formData.lifestyle.sleepHours}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, sleepHours: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stress Level</label>
                      <select
                        value={formData.lifestyle.stressLevel}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, stressLevel: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.lifestyle.smoking}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            lifestyle: { ...prev.lifestyle, smoking: e.target.checked }
                          }))}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">I smoke tobacco products</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Vitals</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Heart Rate (BPM)</label>
                      <input
                        type="number"
                        value={formData.vitals.heartRate}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vitals: { ...prev.vitals, heartRate: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Blood Pressure</label>
                      <input
                        type="text"
                        value={formData.vitals.bloodPressure}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vitals: { ...prev.vitals, bloodPressure: e.target.value }
                        }))}
                        placeholder="120/80"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Glucose (mg/dL)</label>
                      <input
                        type="number"
                        value={formData.vitals.glucose}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vitals: { ...prev.vitals, glucose: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        value={formData.vitals.weight}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vitals: { ...prev.vitals, weight: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </motion.button>
                )}
                {step < 4 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(step + 1)}
                    className="ml-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAssess}
                    disabled={loading}
                    className="ml-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="w-5 h-5" />
                        Get Assessment
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Risk Assessment</h2>
                  <div className={`px-6 py-3 bg-gradient-to-r ${getRiskColor(result.riskLevel)} rounded-full text-white font-bold text-lg shadow-lg`}>
                    {result.riskLevel} Risk
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">Overall Risk Score</span>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{result.riskScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.riskScore}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${getRiskColor(result.riskLevel)}`}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Analysis</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.analysis}</p>
                  </div>

                  {result.concerns && result.concerns.length > 0 && (
                    <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                      <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Health Concerns
                      </h3>
                      <ul className="space-y-2">
                        {result.concerns.map((concern, index) => (
                          <li key={index} className="text-amber-800 dark:text-amber-200 flex items-start gap-2">
                            <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                            <span>{concern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.recommendations && result.recommendations.length > 0 && (
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                      <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-300 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
                            <span className="text-emerald-600 dark:text-emerald-400 mt-1">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setResult(null);
                    setStep(1);
                  }}
                  className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Take Another Assessment
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
