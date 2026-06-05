import dotenv from "dotenv";

dotenv.config();

import { contract } from "./src/blockchain/contract.js";

console.log(await contract.getAddress());
console.log(process.env.CONTRACT_ADDRESS);