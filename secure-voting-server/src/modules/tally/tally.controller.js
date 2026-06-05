import Ballot from "../ballots/ballot.model.js";
import Election from "../elections/election.model.js";
import ElectionKey from "../elections/electionKey/electionKey.model.js";
import Candidate from "../candidates/candidate.model.js";
import ElectionResult from "../results/result.model.js";

import { aggregateVotes } from "../../services/paillier/aggregate.js";
import { decrypt } from "../../services/paillier/decrypt.js";
import { decodeResult } from "../../services/paillier/decode.js";

import crypto from "crypto";
import {writeAudit} from "../audit/audit.service.js";
import Actions from "../../constants/auditActions.js";
import router from "./tally.route.js";
export const tally = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        status: "fail",
        message: "Election not found",
      });
    }
    
    
    if(
    election.status !==
    "voting_closed"
    ){
    return res
    .status(400)
    .json({

      status:"error",

      message:
      "Election not ready"

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
        await writeAudit({

      actorId:
        req.user.userId,

      actorRole:
        req.user.role,

      electionId:
        election._id,

      action:
        Actions.TALLY_RESULT,

      metadata:{
        resultHash
      }

    });
    
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
