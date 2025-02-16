import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { LineChart } from 'lucide-react';
import { Globe, Plane, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MarketPrice, initializeMarketPrices, getUpdatedPrices } from './marketData';
import { useNavigate } from 'react-router-dom';

type ConversionRateKey = '' | 'European Union' | 'UK' | 'Australia' | 'New Zealand' | 'South Korea' | 'China';

interface Transaction {
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  status: 'Pending' | 'Completed' | 'Failed';
  date: string;
}

const Trading: React.FC = () => {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverPrivateKey, setReceiverPrivateKey] = useState('');
  const [ethBalance, setEthBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<ConversionRateKey>(''); // Allow empty string
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>(initializeMarketPrices());
  const [convertedPrice, setConvertedPrice] = useState<number>(0); // Price in USD
  const [lockedPrice, setLockedPrice] = useState<number>(0); // Locked price for 10 seconds
  const [localCurrencyBalance, setLocalCurrencyBalance] = useState<number>(0); // Balance in local currency
  const [usdBalance, setUsdBalance] = useState<number>(0); // Balance in USD
  const [buyingLimit, setBuyingLimit] = useState<number>(0); // Buying limit for the selected region
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date()); // Last update time
  const [transactions, setTransactions] = useState<Transaction[]>([]); // List of transactions

  // Daily buying limit (initial value)
  const [dailyBuyingLimit, setDailyBuyingLimit] = useState<number>(100); // Example initial limit
  const [userDailyPurchases, setUserDailyPurchases] = useState<number>(0); // Track user purchases for the day

  // Smart Buy state
  const [smartBuyEnabled, setSmartBuyEnabled] = useState(false);
  const [targetPrice, setTargetPrice] = useState<number | null>(null);

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
    const interval = setInterval(() => {
      const updatedPrices = getUpdatedPrices();
      setMarketPrices(updatedPrices);
      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update the locked price every 10 seconds
    const lockPriceInterval = setInterval(() => {
      setLockedPrice(convertedPrice);
    }, 10000);

    // Initialize the locked price with the current price
    setLockedPrice(convertedPrice);

    return () => clearInterval(lockPriceInterval);
  }, [convertedPrice]);

  useEffect(() => {
    // Update the price per credit when the selected region or market prices change
    const selectedPrice = marketPrices.find(market => market.market === selectedRegion);
    if (selectedPrice) {
      setConvertedPrice(selectedPrice.price);
    }
  }, [selectedRegion, marketPrices]);

  useEffect(() => {
    if (smartBuyEnabled && targetPrice !== null) {
      const interval = setInterval(async () => {
        const updatedPrices = getUpdatedPrices();
        setMarketPrices(updatedPrices);

        const selectedPrice = updatedPrices.find(market => market.market === selectedRegion);
        if (selectedPrice && selectedPrice.price <= targetPrice) {
          // Execute buy transaction
          try {
            const provider = new ethers.JsonRpcProvider('http://localhost:7545');
            const receiverWallet = new ethers.Wallet(receiverPrivateKey, provider);

            const amountInWei = ethers.parseEther(amount);
            const txResponse = await receiverWallet.sendTransaction({
              to: ganacheAccountAddress,
              value: amountInWei,
            });

            await txResponse.wait();
            console.log("Smart Buy Transaction successful.");

            setEthBalance(prevBalance => prevBalance + parseFloat(amount)); // Increase balance on buy
            calculateConvertedBalances(ethBalance + parseFloat(amount)); // Update converted balances
            setUserDailyPurchases(userDailyPurchases + parseFloat(amount)); // Update daily purchases

            const newTransaction: Transaction = {
              type: 'buy',
              amount: parseFloat(amount),
              price: selectedPrice.price,
              total: parseFloat(amount) * selectedPrice.price,
              status: 'Completed',
              date: new Date().toISOString(),
            };
            setTransactions([...transactions, newTransaction]);

            // Disable smart buy after execution
            setSmartBuyEnabled(false);
            setTargetPrice(null);
          } catch (error) {
            console.error("Error processing smart buy transaction:", error);
          }
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [smartBuyEnabled, targetPrice, selectedRegion, amount, receiverPrivateKey, transactions]);

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
      const conversionRate = selectedPrice.price; // Use the selected market's price as the conversion rate
      setConvertedPrice(conversionRate);

      // Update the buying limit for the selected region
      const regionLimit = dailyBuyingLimit * conversionRate; // Example logic: limit in local currency
      setBuyingLimit(regionLimit);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountInWei = ethers.parseEther(amount);

    if (parseFloat(amount) <= 0) {
      alert('Enter a valid amount!');
      return;
    }

    // Use the locked price for the transaction
    const transactionPrice = lockedPrice;

    // Check if the purchase exceeds the daily limit
    const totalPurchase = userDailyPurchases + parseFloat(amount); // Calculate total purchase for the day
    if (totalPurchase > dailyBuyingLimit) {
      alert(`You cannot exceed your daily buying limit of ${dailyBuyingLimit} credits.`);
      return;
    }

    const provider = new ethers.JsonRpcProvider('http://localhost:7545');

    let newTransaction: Transaction = {
      type: orderType,
      amount: parseFloat(amount),
      price: transactionPrice,
      total: parseFloat(amount) * transactionPrice,
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
        setEthBalance(prevBalance => prevBalance + parseFloat(amount)); // Increase balance on buy
        calculateConvertedBalances(ethBalance + parseFloat(amount)); // Update converted balances
        setUserDailyPurchases(totalPurchase); // Update daily purchases

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
        setEthBalance(prevBalance => prevBalance - parseFloat(amount)); // Decrease balance on sell
        calculateConvertedBalances(ethBalance - parseFloat(amount)); // Update converted balances

        newTransaction.status = 'Completed';
        setTransactions([...transactions, newTransaction]);
      } catch (error) {
        console.error("Error processing sell transaction:", error);
        newTransaction.status = 'Failed';
        setTransactions([...transactions, newTransaction]);
      }
    }
  };

  const MarketCard = ({ market, prices }: { market: string, prices: MarketPrice[] }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {market === 'Compliance Markets' ? <Globe className="h-5 w-5 text-blue-600" /> : <Plane className="h-5 w-5 text-green-600" />}
            <h3 className="text-lg font-semibold text-gray-900">{market}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-sm font-medium rounded-full bg-green-100 text-green-800">
              Live
            </span>
            <LineChart className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {prices.map((price, index) => (
          <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{price.market}</span>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-900">
                  {price.currency}{price.price.toFixed(2)}
                </span>
                <div className={`flex items-center ${
                  price.change > 0 ? 'text-green-600' : price.change < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {price.change !== 0 && (
                    price.change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {price.change > 0 ? '+' : ''}{price.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
            <MarketCard
              market="Compliance Markets"
              prices={marketPrices.filter(market => market.type === 'compliance')}
            />
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
                  {marketPrices
                    .filter(market => market.type === 'compliance')
                    .map((market) => (
                      <option key={market.market} value={market.market}>{market.market}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buying Limit for Today</label>
                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-gray-900 font-medium">{`${buyingLimit.toFixed(2)} Credits`}</span>
                </div>
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
                  <span className="text-gray-900 font-medium">${lockedPrice.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total (USD)</label>
                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-gray-900 font-medium">${((Number(amount) || 0) * (lockedPrice || 0)).toFixed(2)}</span>
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

              {/* Smart Buy Toggle and Target Price Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Smart Buy</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={smartBuyEnabled}
                    onChange={(e) => setSmartBuyEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Enable Smart Buy</span>
                </div>
              </div>

              {smartBuyEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Price (USD)</label>
                  <input
                    type="number"
                    value={targetPrice || ''}
                    onChange={(e) => setTargetPrice(e.target.value ? parseFloat(e.target.value) : null)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
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
                {localCurrencyBalance > 0 && (
                  <div className="bg-gray-50 px-3 py-2 rounded-lg mt-2">
                    <span>{loading ? 'Loading...' : `${localCurrencyBalance.toFixed(2)} Local Currency`}</span>
                  </div>
                )}
                {usdBalance > 0 && (
                  <div className="bg-gray-50 px-3 py-2 rounded-lg mt-2">
                    <span>{loading ? 'Loading...' : `$${usdBalance.toFixed(2)} USD`}</span>
                  </div>
                )}
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${transaction.status === 'Completed' ? 'bg-blue-100 text-blue-800' : transaction.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
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