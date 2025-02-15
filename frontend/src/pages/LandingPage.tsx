import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Leaf, ArrowRight, Wallet2, LineChart, Building2, LogIn } from 'lucide-react';
import AuthPage from './AuthPage'; // Import the AuthPage component

function LandingPage() {
  const [isAuthPageOpen, setIsAuthPageOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-semibold text-gray-900">GreenLedger</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Button variant="ghost">About</Button>
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Marketplace</Button>
              <Button variant="outline" onClick={() => setIsAuthPageOpen(true)}>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Revolutionizing Carbon Credit Trading with{' '}
              <span className="text-primary-600">Blockchain Transparency</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join the future of sustainable finance. Trade carbon credits securely and transparently
              on our blockchain-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="group" onClick={() => setIsAuthPageOpen(true)}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <Wallet2 className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Secure Trading</h3>
              <p className="text-gray-600">
                Trade carbon credits with confidence using blockchain technology and smart contracts.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
                           <LineChart className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Real-time Analytics</h3>
              <p className="text-gray-600">
                Track market trends, monitor your portfolio, and make data-driven decisions.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <Building2 className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Enterprise Ready</h3>
              <p className="text-gray-600">
                Built for businesses of all sizes with comprehensive company management features.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthPageOpen && (
          <AuthPage onClose={() => setIsAuthPageOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingPage;