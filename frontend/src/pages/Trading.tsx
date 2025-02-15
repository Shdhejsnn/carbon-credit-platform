// Trading.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { LineChart } from 'lucide-react';
import { MarketPrice, initializeMarketPrices, getUpdatedPrices } from './marketData'; // Import market data functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// Define the type for conversion rates, allowing an empty string
type ConversionRateKey = '' | 'European Union' | 'UK' | 'Australia' | 'New Zealand' | 'South Korea' | 'China';

interface Transaction {
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  status: string;
  date: string;
}

const Trading: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverPrivateKey, setReceiverPrivateKey] = useState('');
  const [ethBalance, setEthBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<ConversionRateKey>(''); // Allow empty string
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>(initializeMarketPrices());
  const [convertedPrice, setConvertedPrice] = useState<number>(0); // Price in USD
  const [localCurrencyBalance, setLocalCurrencyBalance] = useState<number>(0); // Balance in local currency
  const [usdBalance, setUsdBalance] = useState<number>(0); // Balance in USD
  const [transactions, setTransactions] = useState<Transaction[]>([]); // State to store transaction history

  // Live conversion rates based on the provided market prices
  const conversionRates: Record<ConversionRateKey, { rate: number; currency: string }> = {
    'European Union': { rate: 78.60, currency: '€' },
    'UK': { rate: 45.68, currency: '$' },
    'Australia': { rate: 33.24, currency: 'AUD' },
    'New Zealand': { rate: 62.23, currency: 'NZD' },
    'South Korea': { rate: 6.90, currency: '$' },
    'China': { rate: 93.17, currency: '¥' },
    '': { rate: 0, currency: '' }, // Default case for empty string
  };

  // Your Ganache account details
  const ganacheAccountAddress = '0x43dB9f1C54b380e00Cd7F621Cf172518FC184a47'; // Replace with your Ganache address
  const ganacheAccountPrivateKey = '0x4f7b68ae9950231c2e81a895beb8c452182a5cf8160b0e30697eeac82a86de3e'; // Replace with your Ganache private key

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const provider = new ethers.JsonRpcProvider('http://localhost:7545'); // Ganache RPC URL
        const balance = await provider.getBalance(ganacheAccountAddress); // Fetch balance using the address
        const ethBalance = parseFloat(ethers.formatEther(balance)); // Convert balance from Wei to Ether
        setEthBalance(ethBalance);
        calculateConvertedBalances(ethBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setEthBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance(); // Initial fetch

    // 🔄 Auto-update balance every 5 seconds
    const balanceInterval = setInterval(fetchBalance, 5000);

    return () => clearInterval(balanceInterval); // Cleanup when component unmounts
  }, [ganacheAccountAddress]); // Dependency added to refetch when the address changes

  useEffect(() => {
    // Fetch market prices and update the state
    const updatedPrices = getUpdatedPrices();
    setMarketPrices(updatedPrices);
  }, []);

  const calculateConvertedBalances = (ethAmount: number) => {
    const localBalance = ethAmount * (conversionRates[selectedRegion]?.rate || 0); // Use the selected region's rate
    const usdBalance = localBalance * 0.5; // Example: 1 Local Currency = 0.5 USD
    setLocalCurrencyBalance(localBalance);
    setUsdBalance(usdBalance);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMarket = e.target.value as ConversionRateKey; // Assert the type here
    setSelectedRegion(selectedMarket);

    // Find the selected market price
    const selectedPrice = marketPrices.find(market => market.market === selectedMarket);
    if (selectedPrice) {
      // Convert the price to USD based on the selected market
      const conversionRate = selectedPrice.currency === '$' ? 1 : selectedPrice.price; // Adjust based on your conversion logic
      setConvertedPrice(conversionRate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountInWei = ethers.parseEther(amount);

    if (parseFloat(amount) <= 0) {
      alert('Enter a valid amount!');
      return;
    }

    const provider = new ethers.JsonRpcProvider('http://localhost:7545');

    let newTransaction: Transaction = {
      type: orderType,
      amount: parseFloat(amount),
      price: convertedPrice,
      total: parseFloat(amount) * convertedPrice,
      status: 'Pending',
      date: new Date().toISOString(),
    };

    if (orderType === 'buy') {
      try {
        const receiverWallet = new ethers.Wallet(receiverPrivateKey, provider);
        console.log(`Receiver sending ${amount} CC to ${ganacheAccountAddress}...`);

        const txResponse = await receiverWallet.sendTransaction({
          to: ganacheAccountAddress,
          value: amountInWei,
        });

        await txResponse.wait();
        console.log("Transaction successful.");
        setEthBalance(prevBalance => prevBalance + parseFloat(amount) / convertedPrice); // Increase balance on buy
        calculateConvertedBalances(ethBalance + parseFloat(amount) / convertedPrice); // Update converted balances

        newTransaction.status = 'Completed';
        setTransactions([...transactions, newTransaction]);
      } catch (error) {
        console.error("Error processing buy transaction:", error);
        newTransaction.status = 'Failed';
        setTransactions([...transactions, newTransaction]);
      }
    } else {
      try {
        const userWallet = new ethers.Wallet(ganacheAccountPrivateKey, provider);
        console.log(`Sending ${amount} CC to ${receiverAddress}...`);

        const txResponse = await userWallet.sendTransaction({
          to: receiverAddress,
          value: amountInWei,
        });

        await txResponse.wait();
        console.log("Sell transaction successful.");
        setEthBalance(prevBalance => prevBalance - parseFloat(amount) / convertedPrice); // Decrease balance on sell
        calculateConvertedBalances(ethBalance - parseFloat(amount) / convertedPrice); // Update converted balances

        newTransaction.status = 'Completed';
        setTransactions([...transactions, newTransaction]);
      } catch (error) {
        console.error("Error processing sell transaction:", error);
        newTransaction.status = 'Failed';
        setTransactions([...transactions, newTransaction]);
      }
    }
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
            <button
              onClick={() => navigate(-1)} // Back button functionality
              className="text-blue-600 hover:underline"
            >
              Back
            </button>
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
              {marketPrices.map((market) => (
                <div key={market.market} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">{market.market}</span>
                    </div>
                    <span className="font-semibold">{market.currency}{market.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trading Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Trade Carbon Credits</h2>
            <div className="flex space-x-2 mb-6">
              <button
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${orderType === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setOrderType('buy')}
              >
                Buy
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-lg font-medium ${orderType === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setOrderType('sell')}
              >
                Sell
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Region</label>
                <select
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="" disabled>Select a region</option>
                  {marketPrices.map((market) => (
                    <option key={market.market} value={market.market}>{market.market}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Credits)</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Credit (USD)</label>
                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-gray-900 font-medium">${convertedPrice.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total (USD)</label>
                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-gray-900 font-medium">${((Number(amount) || 0) * (convertedPrice || 0)).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Address</label>
                <input
                  type="text"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {orderType === 'buy' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Private Key</label>
                  <input
                    type="text"
                    value={receiverPrivateKey}
                    onChange={(e) => setReceiverPrivateKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              )}

              {/* Balance Display */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold">Balance</h3>
                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                  <span>{loading ? 'Loading...' : `${ethBalance.toFixed(4)} ETH`}</span>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg mt-2">
                  <span>{loading ? 'Loading...' : `${localCurrencyBalance.toFixed(2)} Local Currency`}</span>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg mt-2">
                  <span>{loading ? 'Loading...' : `$${usdBalance.toFixed(2)} USD`}</span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${orderType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {transaction.type === 'buy' ? 'Buy' : 'Sell'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{transaction.amount} Credits</td>
                    <td className="px-6 py-4 whitespace-nowrap">${transaction.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${transaction.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'Completed' ? 'bg-blue-100 text-blue-800' : transaction.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Trading;