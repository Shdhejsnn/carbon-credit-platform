import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Trading: React.FC = () => {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [ethBalance, setEthBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Your Ganache account details (make sure to securely store the private key)
  const ganacheAccountAddress = '0x43dB9f1C54b380e00Cd7F621Cf172518FC184a47'; // Replace with your Ganache address
  const ganacheAccountPrivateKey = '0x4f7b68ae9950231c2e81a895beb8c452182a5cf8160b0e30697eeac82a86de3e'; // Replace with your Ganache private key

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const provider = new ethers.JsonRpcProvider('http://localhost:7545'); // Ganache RPC URL
        const balance = await provider.getBalance(ganacheAccountAddress); // Fetch balance using the address
        const ethBalance = ethers.formatEther(balance); // Convert balance from Wei to Ether
        setEthBalance(parseFloat(ethBalance));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setEthBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountInEther = parseFloat(amount);
    if (amountInEther <= 0) {
      alert('Please enter a valid amount!');
      return;
    }

    if (orderType === 'buy') {
      try {
        // Check if the user has enough balance to proceed
        if (ethBalance < amountInEther) {
          alert('Insufficient balance!');
          return;
        }

        const provider = new ethers.JsonRpcProvider('http://localhost:7545'); // Ganache RPC URL
        const wallet = new ethers.Wallet(ganacheAccountPrivateKey, provider);

        console.log('Buying transaction...');

        const amountInWei = ethers.parseEther(amount); // Convert amount to Wei
        const transaction = {
          to: receiverAddress,
          value: amountInWei,
        };

        console.log(`Sending ${amountInEther} CC to ${receiverAddress}`);

        // Sending transaction to the receiver
        const txResponse = await wallet.sendTransaction(transaction);
        console.log('Transaction response:', txResponse);

        await txResponse.wait(); // Wait for the transaction to be mined
        console.log("Transaction mined successfully.");

        // Update balance after the transaction
        setEthBalance(prevBalance => prevBalance - amountInEther); // Decrease balance by the amount bought

      } catch (error) {
        console.error("Error processing buy transaction:", error);
      }
    } else if (orderType === 'sell') {
      try {
        const provider = new ethers.JsonRpcProvider('http://localhost:7545'); // Ganache RPC URL
        const wallet = new ethers.Wallet(ganacheAccountPrivateKey, provider);

        console.log('Selling transaction...');
        
        const amountInWei = ethers.parseEther(amount); // Convert amount to Wei
        const transaction = {
          to: receiverAddress,
          value: amountInWei, // Send amount to receiver
        };

        console.log(`Sending ${amountInEther} CC to ${receiverAddress}`);

        // Sending transaction from user to the receiver
        const txResponse = await wallet.sendTransaction(transaction);
        console.log('Transaction response:', txResponse);

        await txResponse.wait(); // Wait for the transaction to be mined
        console.log("Transaction mined successfully.");

        // Update balance after the transaction
        setEthBalance(prevBalance => prevBalance + amountInEther); // Increase balance by the amount sold

      } catch (error) {
        console.error("Error processing sell transaction:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (CC)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Address</label>
              <input
                type="text"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Receiver's Ganache Address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-gray-900 font-medium">{loading ? 'Loading...' : `${ethBalance} CC`}</span>
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
      </main>
    </div>
  );
};

export default Trading;
