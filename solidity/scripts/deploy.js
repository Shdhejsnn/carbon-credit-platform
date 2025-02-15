const hre = require("hardhat");

async function main() {
  const CarbonCredit = await hre.ethers.getContractFactory("CarbonCredit");
  
  console.log("Deploying CarbonCredit contract...");
  const carbonCredit = await CarbonCredit.deploy();  // Deploys the contract
  
  // Wait for the transaction to be mined
  const receipt = await carbonCredit.deploymentTransaction().wait(1);

  console.log("CarbonCredit deployed to:", carbonCredit.target);  // Use `target` for the address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
