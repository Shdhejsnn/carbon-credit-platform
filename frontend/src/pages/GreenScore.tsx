import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/greenscore";

const GreenScore = () => {
    const [greenScore, setGreenScore] = useState<number | null>(100); // Default green score
    const [companyAddress, setCompanyAddress] = useState<string>("");

    useEffect(() => {
        if (companyAddress) {
            fetchGreenScore();
        }
    }, [companyAddress]);

    const fetchGreenScore = async () => {
        try {
            // Connect directly to Ganache RPC (no MetaMask)
            const provider = new ethers.JsonRpcProvider('http://localhost:7545');
            // Ganache
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

            // Fetch the Green Score
            const score = await contract.getGreenScore(companyAddress);
            setGreenScore(Number(score));
        } catch (error) {
            console.error("Error fetching Green Score:", error);
        }
    };

    const handleBuyTransaction = async () => {
        try {
            // Connect directly to Ganache RPC (no MetaMask)
            const provider = new ethers.JsonRpcProvider('http://localhost:7545');
            const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY || '', provider);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            // Simulate a buy transaction
            const tx = await contract.updateGreenScore(companyAddress, 10, 0, 10); // Example values
            await tx.wait();

            // Update the green score
            const newScore = greenScore ? greenScore + 10 : 100; // Increase by 10
            setGreenScore(newScore);
        } catch (error) {
            console.error("Error processing buy transaction:", error);
        }
    };

    const handleSellTransaction = async () => {
        try {
            // Connect directly to Ganache RPC (no MetaMask)
            const provider = new ethers.JsonRpcProvider('http://localhost:7545');
            const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY || '', provider);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            // Simulate a sell transaction
            const tx = await contract.updateGreenScore(companyAddress, 0, 10, 10); // Example values
            await tx.wait();

            // Update the green score
            const newScore = greenScore ? greenScore * 2 : 100; // Double the score
            setGreenScore(newScore);
        } catch (error) {
            console.error("Error processing sell transaction:", error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4">Company Green Score</h1>
            <input
                type="text"
                placeholder="Enter Company Address"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="border p-2 w-full mb-2"
            />
            <button
                onClick={fetchGreenScore}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Check Green Score
            </button>
            {greenScore !== null && (
                <div>
                    <p className="mt-4 text-lg">Green Score: {greenScore}</p>
                    <button
                        onClick={handleBuyTransaction}
                        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Buy Credits
                    </button>
                    <button
                        onClick={handleSellTransaction}
                        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Sell Credits
                    </button>
                </div>
            )}
        </div>
    );
};

export default GreenScore;