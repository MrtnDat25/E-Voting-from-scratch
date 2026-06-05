import dotenv from "dotenv";
dotenv.config();
console.log(process.env.PRIVATE_KEY);
console.log("cwd =", process.cwd());

console.log(
  "PK =",
  process.env.PRIVATE_KEY
);

console.log(
  "ENV file loaded"
);
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

const artifactPath = path.resolve(
  "artifacts/contracts/SecureVoting.sol/SecureVoting.json"
);

const ElectionArtifact = JSON.parse(
  fs.readFileSync(artifactPath, "utf8")
);

if (!process.env.CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is missing in .env");
}

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is missing in .env");
}

const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || "http://127.0.0.1:8545"
);

const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  ElectionArtifact.abi,
  wallet
);