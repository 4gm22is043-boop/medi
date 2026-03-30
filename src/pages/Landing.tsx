import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Heart, Brain, TrendingUp, ArrowRight, Zap, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Health Monitoring',
    description: 'Track your vital signs and health metrics in real-time with an intuitive dashboard'
  },
  {
    icon: Brain,
    title: 'AI Disease Detection',
    description: 'Advanced symptom analysis powered by AI to help identify potential health conditions'
  },
  {
    icon: TrendingUp,
    title: 'Risk Assessment',
    description: 'Comprehensive health risk scoring based on your medical history and lifestyle'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your health data is encrypted and secure. Only you can access your information'
  },
  {
    icon: Zap,
    title: 'Instant Insights',
    description: 'Get personalized recommendations and actionable health insights instantly'
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    description: 'Access professional health insights tailored to your specific health profile'
  }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-blue-900/30 dark:to-emerald-900/30 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl dark:bg-blue-600/10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl dark:bg-emerald-600/10"></div>
      </div>

      <nav className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">MediIntel</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Sign Up
            </button>
          </motion.div>
        </div>
      </nav>

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
          <section className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">AI-Powered Healthcare</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                Your Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">Health Companion</span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Advanced AI-powered health monitoring, disease detection, and personalized risk assessment all in one platform. Take control of your health with intelligent insights.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                >
                  Sign In
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative mt-20"
            >
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 p-8 shadow-xl">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { value: '24/7', label: 'Health Monitoring' },
                    { value: 'AI-Powered', label: 'Disease Detection' },
                    { value: 'Secure', label: 'Data Protection' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          <section className="space-y-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Powerful Features</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to monitor and improve your health</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ translateY: -5 }}
                  className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="space-y-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600 to-emerald-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Health?</h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are taking control of their health with MediIntel's intelligent health platform.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Now
              </motion.button>
            </motion.div>
          </section>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 pt-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Why Choose MediIntel?</h3>
              <ul className="space-y-3">
                {[
                  'Advanced AI-powered analysis for accurate health insights',
                  'Real-time monitoring of vital signs and health metrics',
                  'Comprehensive disease detection using symptom analysis',
                  'Personalized recommendations based on your health profile',
                  'Bank-grade security and privacy protection',
                  '24/7 access to your health data'
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 p-8 flex flex-col justify-center"
            >
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">100%</div>
                  <p className="text-gray-600 dark:text-gray-400">Secure & Encrypted</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">Instant</div>
                  <p className="text-gray-600 dark:text-gray-400">AI-Powered Results</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">Easy</div>
                  <p className="text-gray-600 dark:text-gray-400">User-Friendly Platform</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900 dark:text-white">MediIntel</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Intelligent healthcare for everyone</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Health Monitoring</li>
                <li>Disease Detection</li>
                <li>Risk Assessment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Terms of Service</li>
                <li>Privacy</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 MediIntel. All rights reserved. Your health, our priority.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
