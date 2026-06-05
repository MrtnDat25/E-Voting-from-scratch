// import { ethers } from "hardhat";

// async function main() {

//   const Voting =
//     await ethers.getContractFactory(
//       "SecureVoting"
//     );

//   const voting =
//     await Voting.deploy();

//   await voting.waitForDeployment();

//   console.log(
//     "Contract:",
//     await voting.getAddress()
//   );
// }

// main().catch(
//   (error) => {

//     console.error(error);

//     process.exitCode = 1;
//   }
// );