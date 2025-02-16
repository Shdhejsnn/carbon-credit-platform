import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Leaf, ArrowRight, Wallet2, LineChart, Building2, LogIn } from 'lucide-react';

// Lazy load the AuthPage for performance optimization
const AuthPage = lazy(() => import('./AuthPage'));

function LandingPage() {
  const [isAuthPageOpen, setIsAuthPageOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll smoothly to a section
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
              <Button variant="ghost" onClick={() => scrollToSection('about')}>About</Button>
              <Button variant="ghost" onClick={() => scrollToSection('features')}>Features</Button>
              <Button variant="ghost" onClick={() => scrollToSection('marketplace')}>Marketplace</Button>
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
              <Button size="lg" variant="outline" onClick={() => scrollToSection('about')}>
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900">About Our Platform</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform is a blockchain-powered decentralized marketplace designed for the secure, transparent, and verifiable trading of carbon credits. By leveraging Ethereum smart contracts, we ensure that carbon credit transactions are immutable, trustless, and free from centralized control. Our system empowers individuals, organizations, and enterprises to participate in a sustainable carbon economy with confidence.
          </p>
          <h3 className="mt-8 text-2xl font-semibold text-gray-800">Why Carbon Credit Trading?</h3>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Carbon credits are a crucial tool in combating climate change. They allow businesses and individuals to offset their carbon footprint by purchasing credits from verified projects that reduce greenhouse gas emissions. However, the traditional carbon credit market suffers from challenges like lack of transparency, double counting, and inefficient verification processes. Our platform solves these problems using blockchain technology, ensuring that every transaction is traceable, secure, and authentic.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-12 mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <Wallet2 className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Secure User Authentication</h3>
              <p className="text-gray-600">
                We utilize Firebase Authentication to ensure a smooth and secure user experience. Users can register and log in using their email/password or other authentication methods, allowing them to access their account, manage credits, and perform transactions securely.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <LineChart className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Carbon Credit Balance Management</h3>
              <p className="text-gray-600">
                Users can view and track their carbon credit balance in real time. Every transaction updates the user's balance immediately on both the blockchain and MongoDB database, ensuring accurate and up-to-date records.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <Building2 className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Decentralized Trading System</h3>
              <p className="text-gray-600">
                Buy and sell Ethereum-based carbon credits with full transparency. Users can list their carbon credits for sale or purchase available credits. Transactions are verified and recorded on the blockchain, reflecting the updated balance for both the buyer and the seller.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <Wallet2 className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Smart Contracts for Secure Transactions</h3>
              <p className="text-gray-600">
                Eliminates intermediaries and ensures tamper-proof, automated transactions. Smart contracts execute trades automatically when conditions are met, preventing fraud and ensuring transactions are final and immutable.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <LineChart className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Real-Time Transaction Updates</h3>
              <p className="text-gray-600">
                Every trade updates the sender’s and receiver’s balance immediately. As soon as a transaction is completed, the blockchain ledger updates both accounts, ensuring accuracy and transparency.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <Building2 className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Transaction History & Verification</h3>
              <p className="text-gray-600">
                Users can view detailed transaction records for auditing and compliance. The platform logs all trades and transactions, allowing users to access their complete history with timestamps, transaction IDs, and wallet addresses.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <Wallet2 className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Sustainable & Transparent Trading</h3>
              <p className="text-gray-600">
                Encourages businesses and individuals to offset their carbon footprint in a verifiable manner. Every transaction is recorded on the blockchain, providing immutable proof of carbon credit purchases and usage.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <Building2 className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Fast & Cost-Effective Transactions</h3>
              <p className="text-gray-600">
                Optimized smart contracts reduce delays and transaction costs. The platform minimizes gas fees and eliminates third-party fees, making carbon credit trading more efficient and accessible.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >
              <Building2 className="w-12 h-12 text-primary-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Blockchain-Powered Transparency</h3>
              <p className="text-gray-600">
                Ensures every trade is visible and verifiable by all participants. The blockchain ledger maintains a decentralized record of all transactions, preventing manipulation and increasing trust.
              </p>
            </motion.div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600">
              Join us and be part of a revolutionary carbon credit trading system that is transparent, secure, and efficient!
            </p>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900">Carbon Credit Marketplace</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our marketplace is a decentralized platform where users can buy, sell, and trade verified carbon credits in a secure, transparent, and efficient manner. Built on blockchain technology, it eliminates fraud, ensures real-time transactions, and provides immutable proof of ownership.
          </p>
          <h3 className="mt-8 text-2xl font-semibold text-gray-800">How It Works?</h3>
          <ul className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto list-disc list-inside">
            <li>Buy Carbon Credits – Purchase verified carbon credits directly from trusted sellers.</li>
            <li>Sell Carbon Credits – List your carbon credits for sale and connect with buyers.</li>
            <li>Instant Transactions – Smart contracts automate the process, ensuring fast and trustless transactions.</li>
            <li>Complete Transparency – Every trade is recorded on the blockchain, preventing double spending and fraud.</li>
            <li>Wallet Integration – Easily manage your credits with MetaMask, WalletConnect, and other blockchain wallets.</li>
          </ul>
        </div>
      </section>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthPageOpen && (
          <Suspense fallback={<div>Loading...</div>}>
            <AuthPage onClose={() => setIsAuthPageOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} GreenLedger. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;