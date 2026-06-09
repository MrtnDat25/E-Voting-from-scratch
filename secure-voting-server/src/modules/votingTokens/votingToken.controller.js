import crypto from "crypto";

import Election from "../elections/election.model.js";
import ElectionVoter from "../elections/election-voters/electionVoter.model.js";
import VotingToken from "./votingToken.model.js";

import { writeAudit } from "../audit/audit.service.js";
import Actions from "../../constants/auditActions.js";

/**
 * REQUEST VOTING TOKEN (FINAL SAFE VERSION)
 */
export const requestToken = async (req, res) => {
  try {
    const { electionId } = req.body;

    // 1. Get election
    const election = await Election.findById(electionId);

    if (!election) {
      return res.status(404).json({
        status: "error",
        message: "Election not found",
      });
    }

    if (election.status !== "voting_open") {
      return res.status(400).json({
        status: "error",
        message: "Voting is not open",
      });
    }

    // 2. Get or create voter
    let voter = await ElectionVoter.findOne({
      electionId,
      voterId: req.user.userId,
    });

    // 3. Private election check
    if (!voter && election.electionType === "private") {
      return res.status(403).json({
        status: "error",
        message: "Not eligible for this election",
      });
    }

    if (!voter) {
      voter = await ElectionVoter.create({
        electionId,
        voterId: req.user.userId,
        isEligible: true,
        hasVoted: false,
      });
    }

    // 4. Check eligibility
    if (!voter.isEligible) {
      return res.status(403).json({
        status: "error",
        message: "Not eligible",
      });
    }

    // 5. Check already voted
    if (voter.hasVoted) {
      return res.status(400).json({
        status: "error",
        message: "Already voted",
      });
    }

    // 6. CHECK TOKEN EXISTS (replace hasRequestedToken)
    const existingToken = await VotingToken.findOne({
      electionId,
      voterId: req.user.userId,
      status: "active",
      expiresAt: { $gt: new Date() },
    });

    if (existingToken) {
      return res.status(400).json({
        status: "error",
        message: "Token already issued",
      });
    }

    // 7. Generate secure token
    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // 8. Save token (STORE HASH ONLY)
    await VotingToken.create({
      electionId,
      voterId: req.user.userId,
      tokenHash,
      status: "active",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    // 9. Audit log
    await writeAudit({
      actorId: req.user.userId,
      actorRole: "voter",
      electionId,
      action: Actions.REQUEST_TOKEN,
      metadata: {
        electionId,
      },
    });

    // 10. Return RAW token ONLY ONCE
    return res.json({
      status: "success",
      token: rawToken,
      expiresIn: 30 * 60,
    });
  } catch (err) {
    console.error("TOKEN ERROR:", err);

    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};