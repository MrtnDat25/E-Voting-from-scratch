import { buildModule }
from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule(
  "SecureVotingModule",
  (m) => {

    const voting =
      m.contract("SecureVoting");

    return { voting };

  }
);