import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart as LineChartIcon,
  Wallet,
  History,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Leaf,
  LogOut,
} from 'lucide-react';
import { Button } from '../components/Button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockData = {
  balance: 150,
  marketPrice: 25.50,
  priceChange: 2.3,
  transactions: [
    { id: 1, type: 'buy', amount: 50, price: 24.80, date: '2024-03-15' },
    { id: 2, type: 'sell', amount: 20, price: 25.30, date: '2024-03-14' },
    { id: 3, type: 'buy', amount: 30, price: 25.10, date: '2024-03-13' },
  ],
  priceHistory: [
    { date: '2024-03-10', price: 24.20 },
    { date: '2024-03-11', price: 24.50 },
    { date: '2024-03-12', price: 24.80 },
    { date: '2024-03-13', price: 25.10 },
    { date: '2024-03-14', price: 25.30 },
    { date: '2024-03-15', price: 25.50 },
  ],
};

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-semibold text-gray-900">GreenLedger</span>
            </div>
            <Button variant="ghost" className="text-gray-600">
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Carbon Credit Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Wallet className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">Carbon Credit Balance</h3>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{mockData.balance} Credits</p>
          </motion.div>

          {/* Live Market Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <LineChartIcon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">Live Market Price</h3>
            <div className="flex items-center mt-1">
              <p className="text-2xl font-semibold text-gray-900">${mockData.marketPrice}</p>
              <span className="ml-2 flex items-center text-green-600 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                {mockData.priceChange}%
              </span>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm md:col-span-2"
          >
            <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Actions</h3>
            <div className="flex gap-4">
              <Button className="flex-1">
                <ArrowUpRight className="w-5 h-5 mr-2" />
                Buy Credits
              </Button>
              <Button variant="outline" className="flex-1">
                <ArrowDownRight className="w-5 h-5 mr-2" />
                Sell Credits
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Price History</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {mockData.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === 'buy'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {transaction.type === 'buy' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.amount} Credits
                      </p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${transaction.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;