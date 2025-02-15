const hre = require("hardhat");

async function main() {
  // Deploy CarbonCredit Contract
  const CarbonCredit = await hre.ethers.getContractFactory("CarbonCredit");
  console.log("Deploying CarbonCredit contract...");
  const carbonCredit = await CarbonCredit.deploy();  
  await carbonCredit.waitForDeployment();
  console.log("CarbonCredit deployed to:", carbonCredit.target);

  // Deploy GreenScore Contract
  const GreenScore = await hre.ethers.getContractFactory("GreenScore");
  console.log("Deploying GreenScore contract...");
  const greenScore = await GreenScore.deploy();
  await greenScore.waitForDeployment();
  console.log("GreenScore deployed to:", greenScore.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
