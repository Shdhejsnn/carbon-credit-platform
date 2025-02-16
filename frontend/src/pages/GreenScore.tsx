import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/greenscore";

const GreenScore = ({ companyAddress }: { companyAddress: string }) => {
    const [greenScore, setGreenScore] = useState<number | null>(100); // Default green score
    const maxScore = 600; // Maximum score

    useEffect(() => {
        if (companyAddress) {
            fetchGreenScore();
        }
    }, [companyAddress]);

    const fetchGreenScore = async () => {
        try {
            // Connect directly to Ganache RPC (no MetaMask)
            const provider = new ethers.JsonRpcProvider('http://localhost:7545');
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
            {greenScore !== null && (
                <div>
                    <p className="mt-4 text-lg">Green Score: {greenScore} / {maxScore}</p>
                    <div className="relative w-full h-4 bg-gray-200 rounded">
                        <div 
                            className="absolute h-full bg-green-500 rounded"
                            style={{ width: `${(greenScore / maxScore) * 100}%` }} // Progress bar width
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GreenScore;