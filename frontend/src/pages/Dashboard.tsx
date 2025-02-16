import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { Activity, ArrowUpRight, ArrowDownRight, Globe, LineChartIcon, LogOut, Plane } from 'lucide-react';
import { Button } from '../components/Button';
import { MarketPrice } from './types';
import { initializeMarketPrices, getUpdatedPrices } from './marketData';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract'; // Correct import

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>(initializeMarketPrices());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [ethBalance, setEthBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [companyId, setCompanyId] = useState<string>('');
  const [greenScore, setGreenScore] = useState<number | null>(null); // State for Green Score

  // Replace with your own Ganache account details (address and private key)
  const ganacheAccountAddress = '0x43dB9f1C54b380e00Cd7F621Cf172518FC184a47'; // Replace with your Ganache address
  const ganacheAccountPrivateKey = '0x4f7b68ae9950231c2e81a895beb8c452182a5cf8160b0e30697eeac82a86de3e'; // Replace with your Ganache private key

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
  }, []);

  // Fetch company details and Green Score
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companyId) return;

      try {
        const provider = new ethers.JsonRpcProvider('http://localhost:7545'); // Connect to Ganache
        const signer = new ethers.Wallet(ganacheAccountPrivateKey, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer); // Create contract instance

        const company = await contract.companies(companyId); // Fetch company details
        setCompanyDetails(company);

        // Fetch the Green Score for the company
        const score = await contract.getGreenScore(companyId); // Fetch Green Score
        setGreenScore(Number(score)); // Set Green Score state
      } catch (error) {
        console.error("Error fetching company details or Green Score:", error);
        setCompanyDetails(null);
        setGreenScore(null); // Reset Green Score on error
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  // Fetch live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedPrices = getUpdatedPrices();
      setMarketPrices(updatedPrices);
      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Handle navigation to GreenScore page
  const handleGreenScoreClick = () => {
    navigate('/greenscore', { state: { greenScore } }); // Pass the Green Score to the GreenScore page
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
              <Button 
                variant="default" 
                onClick={handleGreenScoreClick} 
                className="bg-white text-green-600 border border-green-600 hover:bg-green-600 hover:text-white transition duration-200"
              >
                GreenScore
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
        {/* Company ID Input and Fetch Button */}
        <div className="flex items-center space-x-4 mb-6">
          <input 
            type="text"
            placeholder="Enter Company ID"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="border rounded-md p-2 text-sm"
          />
          <Button variant="default" onClick={() => {/* Fetch company logic */}}>Fetch Company</Button>
        </div>

        {/* Balance and Trading Button Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm flex-1 mr-4">
            <h3 className="text-lg font-semibold text-gray-900">Ethereum Balance</h3>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {loading ? "Loading..." : ethBalance.toFixed(4)} ETH
            </p>
          </div>
          
          {/* Company Details Section */}
          {companyDetails ? (
            <div className="bg-white p-6 rounded-xl shadow-sm flex-1 mr-4">
              <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
              <p className="text-sm text-gray-500">Company ID: {companyId}</p>
              <p className="text-sm text-gray-500">Company Name: {companyDetails.name?.toString()}</p>
              <p className="text-sm text-gray-500">Threshold: {companyDetails.creditThreshold?.toString()}</p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm flex-1 mr-4">
              <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
              <p className="text-sm text-gray-500">Loading company details...</p>
            </div>
          )}

          <Button variant="default" onClick={() => navigate('/trading')} className="h-12">
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
      </main>
    </div>
  );
};

// MarketCard Component
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

export default Dashboard;