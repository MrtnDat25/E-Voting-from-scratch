import { contract }
from "./src/blockchain/contract.js";

const tx =
  await contract.createElection(
    1,
    "0x1111111111111111111111111111111111111111111111111111111111111111"
  );

const receipt =
  await tx.wait();

console.log(receipt.hash);