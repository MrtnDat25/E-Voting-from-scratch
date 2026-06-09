import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const isWindows = process.platform === "win32";

function run(cmd) {
  return execSync(cmd, { stdio: "inherit" });
}

function runOutput(cmd) {
  return execSync(cmd, { encoding: "utf-8" });
}

console.log("\n🧹 [1/6] Cleaning ignition cache...");

try {
  run(
    isWindows
      ? "rmdir /s /q ignition\\deployments"
      : "rm -rf ignition/deployments"
  );
} catch {
  console.log("⚠️ No cache found");
}

console.log("\n[2/6] Compiling contracts...");
run("npx hardhat compile");

console.log("\n[3/6] Deploying via Ignition...");

const output = runOutput(
  "npx hardhat ignition deploy .\\ignition\\modules\\SecureVoting.ts --network localhost"
);

console.log(output);

console.log("\n🔎 [4/6] Extracting contract address...");

let contractAddress = null;

// STRICT PARSE
const match = output.match(/0x[a-fA-F0-9]{40}/g);

if (match && match.length > 0) {
  contractAddress = match[match.length - 1];
}

if (!contractAddress) {
  throw new Error("Cannot extract contract address");
}

console.log("📦 New Contract Address:", contractAddress);

console.log("\n[5/6] Updating .env...");

const envPath = path.resolve(".env");

if (!fs.existsSync(envPath)) {
  throw new Error(".env file not found");
}

let env = fs.readFileSync(envPath, "utf-8");

// FIX: remove spaces issue
const newLine = `CONTRACT_ADDRESS=${contractAddress}`;

if (env.includes("CONTRACT_ADDRESS=")) {
  env = env.replace(/^CONTRACT_ADDRESS=.*$/m, newLine);
} else {
  env += `\n${newLine}\n`;
}

fs.writeFileSync(envPath, env, "utf-8");

// VERIFY
const check = fs.readFileSync(envPath, "utf-8");

if (!check.includes(contractAddress)) {
  throw new Error(".env update failed");
}

console.log(".env updated successfully");

console.log("\n[6/6] Restarting backend via PM2...");

try {
  run("pm2 restart backend");
  console.log("Backend restarted via PM2");
} catch {
  console.log("PM2 not found");
  console.log("Run manually:");
  console.log("   pm2 start server.js --name backend");
}

console.log("\nDONE!");
console.log("Contract:", contractAddress);
console.log("System ready!");