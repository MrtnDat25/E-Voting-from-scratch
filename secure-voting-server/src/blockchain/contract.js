import dotenv from "dotenv";
dotenv.config();
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// Load artifact
const artifactPath = path.resolve(
  "artifacts/contracts/SecureVoting.sol/SecureVoting.json"
);

const ElectionArtifact = JSON.parse(
  fs.readFileSync(artifactPath, "utf8")
);

// Kiểm tra env
const address = process.env.CONTRACT_ADDRESS;

if (!address) {
  throw new Error("CONTRACT_ADDRESS is missing in .env");
}

// Provider
const provider = new ethers.JsonRpcProvider(
  "http://127.0.0.1:8545"
);

// Contract read-only
const contract = new ethers.Contract(
  address,
  ElectionArtifact.abi,
  provider
);

// Contract có signer
async function getContractWithSigner() {
  const signer = await provider.getSigner();
  return contract.connect(signer);
}

console.log("ENV =", process.env.CONTRACT_ADDRESS);

export { contract, getContractWithSigner };