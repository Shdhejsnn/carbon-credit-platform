const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
const senderPrivateKey = "YOUR_SENDER_PRIVATE_KEY_HERE"; // Replace with one of your Ganache account private keys
const receiverAddress = "YOUR_RECEIVER_ADDRESS_HERE";    // Replace with another Ganache account address

async function main() {
    const wallet = new ethers.Wallet(senderPrivateKey, provider);
    console.log("Sender Address:", wallet.address);

    const tx = await wallet.sendTransaction({
        to: receiverAddress,
        value: ethers.utils.parseEther("1.0"),  // Sending 1 ETH
    });

    console.log("Transaction Sent! Hash:", tx.hash);
    await tx.wait();
    console.log("Transaction Mined!");
}

main().catch(console.error);
