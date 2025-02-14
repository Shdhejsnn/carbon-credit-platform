import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Leaf, ArrowRight, Wallet2, LineChart, X, Building2, LogIn } from 'lucide-react';

function LandingPage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

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
              <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
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
              <Button size="lg" className="group" onClick={() => setIsRegisterModalOpen(true)}>
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

      {/* Registration Modal */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsRegisterModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl mx-4 my-8 bg-white rounded-2xl shadow-xl"
            >
              <div className="max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="sticky top-0 z-10 bg-white px-8 py-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Company Registration</h2>
                      <p className="text-sm text-gray-500 mt-1">Create your corporate account to start trading carbon credits</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsRegisterModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="px-8 py-6">
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Registration Number *
                        </label>
                        <input
                          type="text"
                          id="registrationNumber"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="industryType" className="block text-sm font-medium text-gray-700 mb-1">
                          Industry Type *
                        </label>
                        <select
                          id="industryType"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Industry</option>
                          <option value="energy">Energy</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="transportation">Transportation</option>
                          <option value="agriculture">Agriculture</option>
                          <option value="technology">Technology</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <input
                          type="text"
                          id="country"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          id="website"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="taxID" className="block text-sm font-medium text-gray-700 mb-1">
                          Tax ID *
                        </label>
                        <input
                          type="text"
                          id="taxID"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-end space-x-4">
                        <Button type="button" variant="ghost" onClick={() => setIsRegisterModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Register Company
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsLoginModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
                  <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="loginEmail"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="loginPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Sign In
                </Button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      setIsRegisterModalOpen(true);
                    }}
                  >
                    Register now
                  </button>
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingPage;