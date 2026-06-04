const Ballot = require("../ballots/ballot.model");
const Election = require("../elections/election.model");
const ElectionKey = require("../elections/electionKey/electionKey.model");
const Candidate = require("../candidates/candidate.model");
const ElectionResult = require("../results/result.model");

const { aggregateVotes } = require("../../services/paillier/aggregate");
const { decrypt } = require("../../services/paillier/decrypt");
const { decodeResult } = require("../../services/paillier/decode");

const crypto = require("crypto");

exports.tally = async (req, res) => {
  try {
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
        winners: [],
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

    // FIX: phải là find() chứ không phải countDocuments()
    const candidates = await Candidate.find({
      electionId: election._id,
    }).sort({ createdAt: 1 });

    const result = decodeResult(decrypted, candidates.length);

    const formattedResults = candidates.map((candidate, index) => ({
      candidateId: candidate._id,
      votes: result[index] || 0,
    }));

    // FIX TIE LOGIC (MULTI WINNER)
    const maxVotes = Math.max(
      ...formattedResults.map((x) => x.votes)
    );

    const winners = formattedResults.filter(
      (x) => x.votes === maxVotes
    );

    // HASH FOR AUDIT
    const resultHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(formattedResults))
      .digest("hex");

    // SAVE RESULT
    await ElectionResult.create({
      electionId: election._id,
      encryptedTotal,
      decryptedTotal: decrypted.toString(),
      results: formattedResults,
      winnerCandidateIds: winners.map((w) => w.candidateId),
      resultHash,
    });

    election.status = "published";
    await election.save();

    // RESPONSE
    return res.json({
      status: "success",
      winners,
      result: formattedResults,
    });

  } catch (err) {
    console.error("Tally error:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};