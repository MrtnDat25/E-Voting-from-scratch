const Election = require("./election.model");

const generateInviteCode = require(
  "../../utils/generateInviteCode"
);

const {
  hashElection,
} = require(
  "../../utils/hashElection"
);

const {
  generateKeyPair,
} = require(
  "../../services/paillier/keygen"
);

const ElectionKey = require(
  "./electionKey/electionKey.model"
);

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
      "Missing required fields"
    );
  }

  // Generate Paillier key pair
  const {
    publicKey,
    privateKey,
  } = generateKeyPair();

  // Generate invite code nếu private
  let inviteCode = null;

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

    const changeStatus =
    async (req,res)=>{

    const election =
    await Election.findById(
      req.params.id
    );

    election.status =
      req.body.status;

    await election.save();

    res.json({
      status:"success"
    });

    };
module.exports = {
  createElection,
  changeStatus,
};