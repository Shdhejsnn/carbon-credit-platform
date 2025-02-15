import React, { useState, useEffect } from 'react';
import { LineChart, ArrowUpRight, ArrowDownRight, Clock, DollarSign } from 'lucide-react';

function App() {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    // Load the carbon prices widget script
    const script = document.createElement('script');
    script.src = 'https://carboncredits.com/live-carbon-prices/index.js.php';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order submission
    console.log(`${orderType} order:`, { amount, price });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <LineChart className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">GreenLedger Trading</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Carbon Credits Market</h2>
              <div id="carbon-prices" className="w-full">
                {/* Carbon Prices Widget will be loaded here */}
              </div>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowUpRight className="h-5 w-5 text-green-500" />
                    <span className="ml-2 text-sm text-gray-500">24h High</span>
                  </div>
                  <span className="font-semibold">$25.45</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowDownRight className="h-5 w-5 text-red-500" />
                    <span className="ml-2 text-sm text-gray-500">24h Low</span>
                  </div>
                  <span className="font-semibold">$23.12</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="ml-2 text-sm text-gray-500">24h Volume</span>
                  </div>
                  <span className="font-semibold">1,234 Credits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Trade Carbon Credits</h2>
            <div className="flex space-x-2 mb-6">
              <button
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                  orderType === 'buy'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setOrderType('buy')}
              >
                Buy
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                  orderType === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setOrderType('sell')}
              >
                Sell
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (Credits)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Credit (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total (USD)
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-gray-900 font-medium">
                    ${((Number(amount) || 0) * (Number(price) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                  orderType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {orderType === 'buy' ? 'Buy Carbon Credits' : 'Sell Carbon Credits'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Buy
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">100 Credits</td>
                  <td className="px-6 py-4 whitespace-nowrap">$24.50</td>
                  <td className="px-6 py-4 whitespace-nowrap">$2,450.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Sell
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">50 Credits</td>
                  <td className="px-6 py-4 whitespace-nowrap">$24.75</td>
                  <td className="px-6 py-4 whitespace-nowrap">$1,237.50</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;