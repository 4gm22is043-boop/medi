import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard as Edit2, Trash2, Save, X, Heart, Activity, Thermometer, Wind, Droplet, TrendingUp } from 'lucide-react';
import { healthRecordsAPI } from '../services/api';
import { HealthRecord } from '../lib/supabase';

export default function HealthMonitoring() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    heart_rate: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    temperature: '',
    oxygen_level: '',
    glucose: '',
    weight: '',
    notes: '',
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await healthRecordsAPI.getAll();
      setRecords(data || []);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      heart_rate: '',
      blood_pressure_systolic: '',
      blood_pressure_diastolic: '',
      temperature: '',
      oxygen_level: '',
      glucose: '',
      weight: '',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recordData = {
      heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
      blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic) : null,
      blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic) : null,
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      oxygen_level: formData.oxygen_level ? parseInt(formData.oxygen_level) : null,
      glucose: formData.glucose ? parseInt(formData.glucose) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      notes: formData.notes,
    };

    try {
      if (editingId) {
        await healthRecordsAPI.update(editingId, recordData);
      } else {
        await healthRecordsAPI.create(recordData);
      }
      await loadRecords();
      resetForm();
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const handleEdit = (record: HealthRecord) => {
    setFormData({
      heart_rate: record.heart_rate?.toString() || '',
      blood_pressure_systolic: record.blood_pressure_systolic?.toString() || '',
      blood_pressure_diastolic: record.blood_pressure_diastolic?.toString() || '',
      temperature: record.temperature?.toString() || '',
      oxygen_level: record.oxygen_level?.toString() || '',
      glucose: record.glucose?.toString() || '',
      weight: record.weight?.toString() || '',
      notes: record.notes || '',
    });
    setEditingId(record.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await healthRecordsAPI.delete(id);
        await loadRecords();
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Health Monitoring</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage your vital signs</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg flex items-center gap-2 transition-colors"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? 'Cancel' : 'Add Record'}
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingId ? 'Edit Health Record' : 'New Health Record'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    value={formData.heart_rate}
                    onChange={(e) => setFormData({ ...formData, heart_rate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 72"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Systolic (mmHg)
                  </label>
                  <input
                    type="number"
                    value={formData.blood_pressure_systolic}
                    onChange={(e) => setFormData({ ...formData, blood_pressure_systolic: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Diastolic (mmHg)
                  </label>
                  <input
                    type="number"
                    value={formData.blood_pressure_diastolic}
                    onChange={(e) => setFormData({ ...formData, blood_pressure_diastolic: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 36.6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-green-500" />
                    Oxygen Level (%)
                  </label>
                  <input
                    type="number"
                    value={formData.oxygen_level}
                    onChange={(e) => setFormData({ ...formData, oxygen_level: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 98"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-purple-500" />
                    Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={formData.glucose}
                    onChange={(e) => setFormData({ ...formData, glucose: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 90"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-teal-500" />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 70.5"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? 'Update' : 'Save'} Record
                </motion.button>
                {editingId && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
                  >
                    Cancel Edit
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Health Records</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No health records yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">Click "Add Record" to start tracking your vitals</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {records.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(record.recorded_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(record)}
                        className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(record.id)}
                        className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {record.heart_rate && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Heart Rate</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{record.heart_rate} <span className="text-sm font-normal">BPM</span></p>
                      </div>
                    )}

                    {(record.blood_pressure_systolic && record.blood_pressure_diastolic) && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-blue-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">BP</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{record.blood_pressure_systolic}/{record.blood_pressure_diastolic}</p>
                      </div>
                    )}

                    {record.temperature && (
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Temp</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{record.temperature}°C</p>
                      </div>
                    )}

                    {record.oxygen_level && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Wind className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">O2</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{record.oxygen_level}%</p>
                      </div>
                    )}

                    {record.glucose && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Droplet className="w-4 h-4 text-purple-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Glucose</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{record.glucose} <span className="text-sm font-normal">mg/dL</span></p>
                      </div>
                    )}

                    {record.weight && (
                      <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-teal-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Weight</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{record.weight} <span className="text-sm font-normal">kg</span></p>
                      </div>
                    )}
                  </div>

                  {record.notes && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{record.notes}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
