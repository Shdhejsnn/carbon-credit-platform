import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const Dashboard: React.FC = () => {
  const [ethBalance, setEthBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Replace with your own Ganache account details (address and private key)
  const ganacheAccountAddress = '0x43dB9f1C54b380e00Cd7F621Cf172518FC184a47';  // Replace with your Ganache address
  const ganacheAccountPrivateKey = '0x4f7b68ae9950231c2e81a895beb8c452182a5cf8160b0e30697eeac82a86de3e'; // Replace with your Ganache private key

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const provider = new ethers.JsonRpcProvider('http://localhost:7545');  // Ganache default RPC URL
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
  }, []);  // Empty dependency array so it runs once on component mount

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Carbon Credit Balance */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Carbon Credit Balance</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {loading ? "Loading..." : ethBalance} Credits
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
