// import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
// import { configVariable, defineConfig } from "hardhat/config";

// export default defineConfig({
//   plugins: [hardhatToolboxMochaEthersPlugin],
//   solidity: {
//     profiles: {
//       default: {
//         version: "0.8.28",
//       },
//       production: {
//         version: "0.8.28",
//         settings: {
//           optimizer: {
//             enabled: true,
//             runs: 200,
//           },
//         },
//       },
//     },
//   },
//   networks: {
//     hardhatMainnet: {
//       type: "edr-simulated",
//       chainType: "l1",
//     },
//     hardhatOp: {
//       type: "edr-simulated",
//       chainType: "op",
//     },
//     sepolia: {
//       type: "http",
//       chainType: "l1",
//       url: configVariable("SEPOLIA_RPC_URL"),
//       accounts: [configVariable(" ")],
//     },
//   },
// });
import type { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.20",

  networks: {
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
    },
  },
};

module.exports = config;