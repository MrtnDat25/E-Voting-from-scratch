import crypto from "crypto";

import Ballot from "./ballot.model.js";
import VotingToken from "../votingTokens/votingToken.model.js";
import Election from "../elections/election.model.js";
import Candidate from "../candidates/candidate.model.js";

import { encodeVote } from "../../services/paillier/encode.js";
import { encrypt } from "../../services/paillier/encrypt.js";

import { writeAudit } from "../audit/audit.service.js";
import Actions from "../../constants/auditActions.js";

import { contract } from "../../blockchain/contract.js";

import ElectionVoter from "../elections/election-voters/electionVoter.model.js";

export const castVote = async (req, res) => {
  try {
    const { token, candidateIndex } = req.body;

    // 1. HASH TOKEN (ANTI PLAINTEXT)
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 2. FIND + LOCK TOKEN (ANTI DOUBLE VOTE)
    const votingToken = await VotingToken.findOneAndUpdate(
      {
        tokenHash,
        status: "active",
        isUsed: false,
        expiresAt: { $gt: new Date() },
      },
      {
        $set: {
          isUsed: true,
          usedAt: new Date(),
        },
      },
      {
        new: true,
      }
    );

    if (!votingToken) {
      return res.status(400).json({
        status: "error",
        message: "Token invalid or already used",
      });
    }

    // 3. GET ELECTION
    const election = await Election.findById(votingToken.electionId);

    if (!election) {
      return res.status(404).json({
        status: "error",
        message: "Election not found",
      });
    }

    if (election.status !== "voting_open") {
      return res.status(400).json({
        status: "error",
        message: "Election closed",
      });
    }

    // 4. VALIDATE CANDIDATE
    const candidate = await Candidate.findOne({
      electionId: election._id,
      candidateIndexOnChain: candidateIndex,
    });

    if (!candidate) {
      return res.status(400).json({
        status: "error",
        message: "Invalid candidate",
      });
    }

    // 5. ENCODE + ENCRYPT
    const plaintext = encodeVote(candidateIndex);

    const encryptedVote = encrypt(
      plaintext,
      election.paillierPublicKey
    );

    // 6. CREATE BALLOT HASH (FIXED)
    const ballotHash = crypto
      .createHash("sha256")
      .update(
        JSON.stringify({
          encryptedVote,
          electionId: election._id.toString(),
          tokenId: votingToken._id.toString(),
          timestamp: Date.now(),
        })
      )
      .digest("hex");

    // 7. BLOCKCHAIN SUBMIT
    if (!election.chainElectionId) {
      throw new Error("Missing chainElectionId");
    }

    const tx = await contract.submitBallot(
      BigInt(election.chainElectionId),
      "0x" + ballotHash
    );

    const receipt = await tx.wait();

    // 8. SAVE BALLOT
    await Ballot.create({
      electionId: votingToken.electionId,
      encryptedVote,
      blockchain: {
        ballotHash,
        txHash: tx.hash,
      },
    });

    // 9. MARK VOTER HAS VOTED (IMPORTANT)
    await ElectionVoter.updateOne(
      {
        electionId: votingToken.electionId,
        voterId: votingToken.voterId,
      },
      {
        hasVoted: true,
        votedAt: new Date(),
      }
    );

    // 10. AUDIT LOG
    await writeAudit({
      actorId: req.user.userId,
      actorRole: "voter",
      electionId: votingToken.electionId,
      action: Actions.CAST_VOTE,
      metadata: { ballotHash },
    });

    // 11. RESPONSE
    return res.json({
      status: "success",
      ballotHash,
      txHash: tx.hash,
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};