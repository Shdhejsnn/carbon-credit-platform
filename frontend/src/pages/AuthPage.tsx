import React, { useState } from 'react';
import { Button } from '../components/Button';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../pages/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';

interface AuthPageProps {
  onClose: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState(0);
  const [companyIndustry, setCompanyIndustry] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful!");
      onClose();
      navigate('/dashboard'); 
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registration successful!");

      // Directly use the private key and other details
      const provider = new ethers.JsonRpcProvider('http://localhost:7545');
      const signer = new ethers.Wallet('0x9239c6a1b08530165994e3c25520043f7e2293ca590c759f71a93ad28f2a8574', provider); // Replace with your actual private key
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.registerCompany(
        companyAddress,
        companyName,
        companySize,
        companyIndustry,
        companyLocation
      );
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        console.error("Transaction reverted");
        alert("Transaction reverted");
        return;
      }

      // Confirm registration by querying the contract
      const registeredCompany = await contract.companies(companyAddress);
      if (registeredCompany.exists) {
        console.log("Company registered on the smart contract!");
        alert("Company registered successfully!");
        onClose();
        navigate('/dashboard'); 
      } else {
        console.error("Company registration failed");
        alert("Company registration failed");
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        if (error.code === "auth/email-already-in-use") {
          alert("The email address is already in use by another account.");
          return;
        }
      }
      console.error("Registration error:", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Company Address *
              </label>
              <input
                type="text"
                id="companyAddress"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          )}
          {!isLogin && (
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          )}
          {!isLogin && (
            <div>
              <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                Company Size (number of employees) *
              </label>
              <input
                type="number"
                id="companySize"
                value={companySize}
                onChange={(e) => setCompanySize(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          )}
          {!isLogin && (
            <div>
              <label htmlFor="companyIndustry" className="block text-sm font-medium text-gray-700 mb-1">
                Company Industry *
              </label>
              <input
                type="text"
                id="companyIndustry"
                value={companyIndustry}
                onChange={(e) => setCompanyIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          )}
          {!isLogin && (
            <div>
              <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Company Location (Urban/Rural) *
              </label>
              <input
                type="text"
                id="companyLocation"
                value={companyLocation}
                onChange={(e) => setCompanyLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full" size="lg">
            {isLogin ? 'Sign In' : 'Register'}
          </Button>
          <p className="text-sm text-gray-500 text-center mt-4">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register now' : 'Login here'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;