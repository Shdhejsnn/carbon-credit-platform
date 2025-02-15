import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import {
  LineChart as LineChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Plane,
  Activity,
  LogOut,
  User, // Import the User icon for profile
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
import { MarketPrice, Transaction } from './types';
import { initializeMarketPrices, getUpdatedPrices } from './marketData';

// Carbon Prices Widget
const CarbonPricesWidget: React.FC = () => {
  const [carbonPrices, setCarbonPrices] = useState<string>("Fetching live carbon prices...");

  useEffect(() => {
    fetch("http://localhost:5000/api/carbon-prices", { mode: "cors" })
      .then((response) => response.json())
      .then((data) => {
        if (data.prices) {
          setCarbonPrices(data.prices);
        } else {
          setCarbonPrices("⚠️ Unable to fetch live prices.");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setCarbonPrices("⚠️ Error fetching prices.");
      });
  }, []);

  return (
    <div id="carbon-prices" className="bg-white p-6 rounded-xl shadow-sm">
      <p className="text-gray-700 text-sm">{carbonPrices}</p>
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>(initializeMarketPrices());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'buy', amount: 50, price: 24.80, date: '2024-03-15' },
    { id: 2, type: 'sell', amount: 20, price: 25.30, date: '2024-03-14' },
    { id: 3, type: 'buy', amount: 30, price: 25.10, date: '2024-03-13' },
  ]);
  const [ethBalance, setEthBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Replace with your own Ganache account details (address)
  const ganacheAccountAddress = '0x43dB9f1C54b380e00Cd7F621Cf172518FC184a47'; // Replace with your Ganache address

  // Fetch Ethereum balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const provider = new ethers.JsonRpcProvider('http://localhost:7545'); // Ganache default RPC URL
        const balance = await provider.getBalance(ganacheAccountAddress); // Fetch balance using the address
        const ethBalance = ethers.formatEther(balance); // Convert balance from Wei to Ether
        setEthBalance(parseFloat(ethBalance));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setEthBalance(0); // Set balance to 0 if there's an error
      } finally {
        setLoading(false); // Stop loading once balance is fetched
      }
    };

    fetchBalance();
  }, []); // Empty dependency array so it runs once on component mount

  // Fetch live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedPrices = getUpdatedPrices();
      setMarketPrices(updatedPrices);
      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
            <LineChartIcon className="h-4 w-4 text-gray-400" />
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
            <div className="mt-2">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    price.change > 0 ? 'bg-green-500' : price.change < 0 ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${Math.min(Math.abs(price.change), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Handle navigation to Trading page for Buy/Sell actions
  const handleTransactionClick = () => {
    navigate('/trading');
  };

  // Handle navigation to Profile page
  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">GreenLedger</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600" onClick={handleProfileClick}>
                <User  className="w-5 h-5 mr-1" /> Profile
              </Button>
              <Button variant="ghost" className="text-gray-600" onClick={() => navigate('/')}>
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance and Trading Button Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm flex-1 mr-4">
            <h3 className="text-lg font-semibold text-gray-900">Ethereum Balance</h3>
            <p className={`text-2xl font-semibold mt-1 ${loading ? "text-gray-500" : ethBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {loading ? "Loading..." : ethBalance.toFixed(4)} ETH
            </p>
          </div>
          <Button variant="default" onClick={handleTransactionClick} className="h-12">
            Go to Trading
          </Button>
        </div>

        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              Carbon Markets Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Real-time carbon prices across global markets
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <MarketCard 
            market="Compliance Markets" 
            prices={marketPrices.filter(p => p.type === 'compliance')} 
          />
          <MarketCard 
            market="Voluntary Markets" 
            prices={marketPrices.filter(p => p.type === 'voluntary')} 
          />
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${transaction.type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {transaction.type === 'buy' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.amount} Credits</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">${transaction.price}</p>
                <Button variant="default" onClick={handleTransactionClick}>
                  {transaction.type === 'buy' ? 'Buy More' : 'Sell More'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;