import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/greenscore";

const GreenScore = () => {
    const [greenScore, setGreenScore] = useState<number | null>(null);
    const [companyAddress, setCompanyAddress] = useState("");

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
                <p className="mt-4 text-lg">Green Score: {greenScore}</p>
            )}
        </div>
    );
};

export default GreenScore;
