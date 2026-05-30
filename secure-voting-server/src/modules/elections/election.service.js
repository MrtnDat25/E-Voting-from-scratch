const Election = require("./election.model");

const generateInviteCode = require("../../utils/generateInviteCode");

// FIX IMPORT ĐÚNG KIỂU (quan trọng)
const { hashElection } = require("../../utils/hashElection");

const { generateKeyPair } = require("../../services/crypto/paillier.service");

/**
 * CREATE ELECTION
 */
const createElection = async (user, data) => {
  const {
    title,
    description,
    electionType,
    startTime,
    endTime,
  } = data;

  if (!title || !electionType || !startTime || !endTime) {
    throw new Error("Missing required fields");
  }

  // 1. Generate Paillier key pair
  const keyPair = await generateKeyPair();

  // 2. Generate invite code nếu private
  let inviteCode = null;

  if (electionType === "private") {
    inviteCode = generateInviteCode();
  }

  // 3. Build election data trước (IMPORTANT)
  const electionData = {
    companyId: user.userId,
    title,
    description,
    electionType,
    inviteCode,
    startTime,
    endTime,
    paillierPublicKey: keyPair.publicKey,
  };

  // 4. Hash election BEFORE save (FIX BUG SAVE TRƯỚC)
  const electionHash = hashElection({
    title,
    description,
    electionType,
    startTime,
    endTime,
    companyId: user.userId,
  });

  electionData.electionHashOnChain = electionHash;

  // 5. Save 1 lần duy nhất (CLEAN)
  const election = await Election.create(electionData);

  return {
    status: "success",
    data: election,
  };
};

module.exports = {
  createElection,
};