const Ballot = require("../ballots/ballot.model");
const Election = require("../elections/election.model");
const ElectionKey = require("../elections/electionKey/electionKey.model");
const Candidate = require("../candidates/candidate.model");

const { aggregateVotes } = require("../../services/paillier/aggregate");
const { decrypt } = require("../../services/paillier/decrypt");
const { decodeResult } = require("../../services/paillier/decode");

exports.tally = async (req, res) => {
  const election = await Election.findById(req.params.id);

  if (!election) {
    return res.status(404).json({
      status: "fail",
      message: "Election not found",
    });
  }

  const ballots = await Ballot.find({
    electionId: election._id,
  });

  if (!ballots.length) {
    return res.json({
      status: "success",
      result: [],
    });
  }

  const encryptedTotal = aggregateVotes(
    ballots.map((x) => x.encryptedVote),
    election.paillierPublicKey.n
  );

  const key = await ElectionKey.findOne({
    electionId: election._id,
  });

  if (!key) {
    return res.status(400).json({
      status: "fail",
      message: "Election key not found",
    });
  }

  const decrypted = decrypt(encryptedTotal, {
    n: election.paillierPublicKey.n,
    lambda: key.lambda,
    mu: key.mu,
  });

  const candidates = await Candidate.countDocuments({
    electionId: election._id,
  });

  const result = decodeResult(decrypted, candidates);

  return res.json({
    status: "success",
    result,
  });
};