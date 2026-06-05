import crypto 
  from"crypto";

import Ballot 
  from"./ballot.model.js";

import VotingToken 
  from
    "../votingTokens/votingToken.model.js"
  ;

import Election 
  from
    "../elections/election.model.js"
  ;

import {
  encodeVote
} 
  from
    "../../services/paillier/encode.js"
  ;

import {
  encrypt
} 
  from
    "../../services/paillier/encrypt.js"
  ;

import {writeAudit}  from"../audit/audit.service.js";
import Actions  from"../../constants/auditActions.js";

import {contract} from "../../blockchain/contract.js";


export const castVote = async (req, res) => {
  try {
    const { token, candidateIndex } = req.body;

    // 1. find token
    const votingToken = await VotingToken.findOne({
      token,
      status: "active",
    });

    if (!votingToken) {
      return res.status(400).json({
        status: "error",
        message: "Invalid token",
      });
    }

    if (votingToken.isUsed) {
      return res.status(400).json({
        status: "error",
        message: "Token already used",
      });
    }

    // 2. get election
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

    // 3. encode + encrypt vote
    const plaintext = encodeVote(candidateIndex);
    console.log("candidateIndex:", candidateIndex);
    console.log("plaintext:", plaintext);
    console.log("paillier key:", election.paillierPublicKey);
    const encryptedVote = encrypt(
      plaintext,
      election.paillierPublicKey
    );

    // 4. hash ballot
    const ballotHash = crypto
      .createHash("sha256")
      .update(JSON.stringify({
        encryptedVote,
        electionId: election.chainElectionId,
      }))
      .digest("hex");
  //replay attack
  //vote reuse each election
    // 5. submit blockchain
    if (!election.chainElectionId) {
      throw new Error("Missing chainElectionId");
    }

    if (!election.paillierPublicKey) {
      throw new Error("Missing paillierPublicKey");
    }
    const tx = await contract.submitBallot(
      election.chainElectionId, // FIX HERE
      "0x" + ballotHash
    );

    const receipt = await tx.wait(); // FIX HERE

    // 6. save Mongo (ONLY ONCE)
    const ballot = await Ballot.create({
      electionId: votingToken.electionId,
      encryptedVote,
      blockchain: {
        ballotHash,
        txHash: receipt.hash,
      },
    });

    // 7. mark token used
    votingToken.isUsed = true;
    await votingToken.save();

    // 8. audit log
    await writeAudit({
      actorId: req.user.userId,
      actorRole: "voter",
      electionId: votingToken.electionId,
      action: Actions.CAST_VOTE,
      metadata: { ballotHash },
    });
    return res.json({
      status: "success",
      ballotHash,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
  
};