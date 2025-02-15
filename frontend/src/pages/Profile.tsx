// Profile.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { Button } from '../components/Button';
import { User, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [ethBalance, setEthBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastTransactions, setLastTransactions] = useState<any[]>([]); // Replace with actual transaction type

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

  // Sample user data (replace with actual user data)
  const userName = "John Doe"; // Example user name
  const userPrivateKey = "0x4f7b68ae9950231c2e81a895beb8c452182a5cf8160b0e30697eeac82a86de3e"; // Example private key

  // Sample transactions (replace with actual transaction fetching logic)
  useEffect(() => {
    // Replace this with actual logic to fetch transactions
    const fetchTransactions = () => {
      const transactions = [
        { id: 1, type: 'buy', amount: 50, price: 24.80, date: '2024-03-15' },
        { id: 2, type: 'sell', amount: 20, price: 25.30, date: '2024-03-14' },
        { id: 3, type: 'buy', amount: 30, price: 25.10, date: '2024-03-13' },
      ];
      setLastTransactions(transactions);
    };

    fetchTransactions();
  }, []);

  const handleSignOut = () => {
    // Implement sign-out logic here
    navigate('/'); // Redirect to the home page after sign out
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl mb-6">User  Profile</h2>
        
        {/* Back Button */}
        <Button variant="default" onClick={() => navigate(-1)} className="mb-4">
          Back
        </Button>

        {/* User Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex items-center">
            <User  className="h-12 w-12 text-green-600 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{userName}</h3>
              <p className="text-sm text-gray-500">Ethereum Address: {ganacheAccountAddress.slice(0, 6)}...{ganacheAccountAddress.slice(-4)}</p>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Balance</h3>
          <p className={`text-2xl font-semibold mt-1 ${loading ? "text-gray-500" : ethBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {loading ? "Loading..." : ethBalance.toFixed(4)} ETH
          </p>
        </div>

        {/* Last Transactions Card */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Last 3 Transactions</h3>
          <ul className="space-y-2 mt-2">
            {lastTransactions.map(transaction => (
              <li key={transaction.id} className="flex justify-between">
                <span>{transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.amount} Credits</span>
                <span>${transaction.price} on {transaction.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Private Key Card */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Ethereum Private Key</h3>
          <p className="text-sm text-gray-600">{userPrivateKey}</p>
        </div>

        <Button variant="default" onClick={handleSignOut} className="mt-4">
          Sign Out
        </Button>
      </main>
    </div>
  );
};

export default Profile;