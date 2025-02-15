import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Trading = () => {
  const [orderType, setOrderType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverPrivateKey, setReceiverPrivateKey] = useState('');
  const [ethBalance, setEthBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const userAccountAddress = '0x43dB9f1C54b380e00Cd7F621Cf172518FC184a47'; // Replace dynamically from backend
  const userPrivateKey = '0x4f7b68ae9950231c2e81a895beb8c452182a5cf8160b0e30697eeac82a86de3e'; // Replace dynamically from backend

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const provider = new ethers.JsonRpcProvider('http://localhost:7545');
        const balance = await provider.getBalance(userAccountAddress);
        setEthBalance(parseFloat(ethers.formatEther(balance)));
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
  }, [userAccountAddress]); // Dependency added to refetch when the address changes
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amountInWei = ethers.parseEther(amount);

    if (parseFloat(amount) <= 0) {
      alert('Enter a valid amount!');
      return;
    }

    const provider = new ethers.JsonRpcProvider('http://localhost:7545');

    if (orderType === 'buy') {
      try {
        const receiverWallet = new ethers.Wallet(receiverPrivateKey, provider);
        console.log(`Receiver sending ${amount} CC to ${userAccountAddress}...`);

        const txResponse = await receiverWallet.sendTransaction({
          to: userAccountAddress,
          value: amountInWei,
        });

        await txResponse.wait();
        console.log("Transaction successful.");
      } catch (error) {
        console.error("Error processing buy transaction:", error);
      }
    } else {
      try {
        const userWallet = new ethers.Wallet(userPrivateKey, provider);
        console.log(`Sending ${amount} CC to ${receiverAddress}...`);

        const txResponse = await userWallet.sendTransaction({
          to: receiverAddress,
          value: amountInWei,
        });

        await txResponse.wait();
        console.log("Sell transaction successful.");
      } catch (error) {
        console.error("Error processing sell transaction:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Trade Carbon Credits</h2>
          <div className="flex space-x-2 mb-6">
            <button className={`flex-1 py-2 px-4 rounded-lg font-medium ${orderType === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setOrderType('buy')}>
              Buy
            </button>
            <button className={`flex-1 py-2 px-4 rounded-lg font-medium ${orderType === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setOrderType('sell')}>
              Sell
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (CC)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Address</label>
              <input type="text" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>

            {orderType === 'buy' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Private Key</label>
                <input type="text" value={receiverPrivateKey} onChange={(e) => setReceiverPrivateKey(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                <span>{loading ? 'Loading...' : `${ethBalance} CC`}</span>
              </div>
            </div>

            <button type="submit" className={`w-full py-3 px-4 rounded-lg text-white ${orderType === 'buy' ? 'bg-green-600' : 'bg-red-600'}`}>
              {orderType === 'buy' ? 'Buy CC' : 'Sell CC'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Trading;