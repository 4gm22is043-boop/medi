import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, AlertCircle, CheckCircle, X, Loader } from 'lucide-react';
import { diseaseDetectionAPI } from '../services/api';

const COMMON_SYMPTOMS = [
  'Fever', 'Cough', 'Fatigue', 'Headache', 'Sore Throat',
  'Nausea', 'Dizziness', 'Chest Pain', 'Shortness of Breath',
  'Muscle Pain', 'Joint Pain', 'Chills', 'Loss of Appetite',
  'Abdominal Pain', 'Vomiting', 'Diarrhea', 'Runny Nose',
  'Congestion', 'Rash', 'Sweating'
];

interface Disease {
  name: string;
  confidence: number;
  description: string;
}

interface DetectionResult {
  diseases: Disease[];
  recommendations: string;
  severity: string;
}

export default function DiseaseDetection() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredSymptoms = COMMON_SYMPTOMS.filter(
    symptom =>
      symptom.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedSymptoms.includes(symptom)
  );

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const data = await diseaseDetectionAPI.detect(selectedSymptoms);
      setResult(data);
      await diseaseDetectionAPI.saveAssessment(selectedSymptoms, data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to analyze symptoms. Please ensure you have configured the Groq API key for the edge function.';
      setError(errorMsg);
      console.error('Error detecting diseases:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      default: return 'from-green-500 to-teal-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjeWFuIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">AI-Powered Disease Detection</span>
          </div>
          <h1 className="text-5xl font-bold text-white">
            Symptom <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Analysis</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select your symptoms and let our AI analyze potential conditions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Search className="w-6 h-6 text-cyan-400" />
                Select Symptoms
              </h2>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search symptoms..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedSymptoms.map((symptom) => (
                  <motion.div
                    key={symptom}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-medium flex items-center gap-2 shadow-lg shadow-cyan-500/30"
                  >
                    {symptom}
                    <button
                      onClick={() => toggleSymptom(symptom)}
                      className="hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                {filteredSymptoms.map((symptom) => (
                  <motion.button
                    key={symptom}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSymptom(symptom)}
                    className="px-4 py-2 bg-slate-900/50 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg text-gray-300 hover:text-cyan-300 transition-all text-sm font-medium"
                  >
                    {symptom}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={selectedSymptoms.length === 0 || loading}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-bold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Symptoms
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2"
          >
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-200 mb-1">Error</h3>
                      <p className="text-red-100 text-sm">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              {result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                  <div className="bg-slate-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                      <div className={`px-4 py-2 bg-gradient-to-r ${getSeverityColor(result.severity)} rounded-full text-white font-semibold text-sm shadow-lg`}>
                        {result.severity} Risk
                      </div>
                    </div>

                    <div className="space-y-4">
                      {result.diseases?.map((disease, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-slate-900/50 border border-cyan-500/20 rounded-xl"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-white">{disease.name}</h3>
                            <div className="px-3 py-1 bg-cyan-500/20 rounded-full">
                              <span className="text-cyan-300 font-semibold text-sm">{disease.confidence}%</span>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm">{disease.description}</p>
                          <div className="mt-3 w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${disease.confidence}%` }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-purple-400" />
                      Recommendations
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{result.recommendations}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-800/30 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-12 text-center"
                >
                  <Sparkles className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-400 text-lg">
                    Select symptoms and click analyze to see results
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
}
