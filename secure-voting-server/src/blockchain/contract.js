// src/blockchain/contract.js
const { ethers } = require( "ethers");
// if using CommonJS, use: const { ethers } = require("ethers");

// const the artifact JSON

const ElectionArtifact = require( "../../artifacts/contracts/SecureVoting.sol/SecureVoting.json");
// if CommonJS: const ElectionArtifact = require("../artifacts/contracts/SecureVoting.sol/SecureVoting.json");


const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  ElectionArtifact.abi,
  provider
);

async function getContractWithSigner() {
  const signer = await provider.getSigner(0);
  return contract.connect(signer);
}

module.exports = {
  contract,
  getContractWithSigner,
};