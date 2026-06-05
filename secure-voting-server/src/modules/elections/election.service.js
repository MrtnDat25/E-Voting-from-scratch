import  Election from "./election.model.js";

import generateInviteCode  from 
  "../../utils/generateInviteCode.js"
;

import {
  hashElection,
}  from 
  "../../utils/hashElection.js"
;

import {
  generateKeyPair,
}  from 
  "../../services/paillier/keygen.js"
;

import ElectionKey  from 
  "./electionKey/electionKey.model.js"
;

/**
 * CREATE ELECTION
 */
const createElection = async (
  user,
  data
) => {
  const {
    title,
    description,
    electionType,
    startTime,
    endTime,
  } = data;

  if (
    !title ||
    !electionType ||
    !startTime ||
    !endTime
  ) {
    throw new Error(
      "Missing importd fields"
    );
  }

  // Generate Paillier key pair
  const {
    publicKey,
    privateKey,
  } = generateKeyPair();

  // Generate invite code nếu private
  let inviteCode = undefined;

  if (
    electionType ===
    "private"
  ) {
    inviteCode =
      generateInviteCode();
  }

  // Hash election
  const electionHash =
    hashElection({
      title,
      description,
      electionType,
      startTime,
      endTime,
      companyId:
        user.userId,
    });

  // Build election data
  const electionData = {
    companyId:
      user.userId,

    title,

    description,

    electionType,

    inviteCode,

    status: "draft",

    startTime,

    endTime,

    paillierPublicKey:
      publicKey,

    electionHashOnChain:
      electionHash,
  };

  // Save election
  const election =
    await Election.create(
      electionData
    );

  // Save private key
  await ElectionKey.create({
    electionId:
      election._id,

    lambda:
      privateKey.lambda,

    mu:
      privateKey.mu,
  });

  return election;
};


export default {
  createElection,

};