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
exports.castVote =
  async (req, res) => {

    try {

      const {
        token,
        candidateIndex
      } = req.body;

      // 1. find token
      const votingToken =
        await VotingToken.findOne({
          token,
          status: "active",
        });

      if (!votingToken) {
        return res.status(400).json({
          status: "error",
          message: "Invalid token",
        });
      }

      // 2. check token used
      if (votingToken.isUsed) {
        return res.status(400).json({
          status: "error",
          message:
            "Token already used",
        });
      }

      // 3. get election
      const election =
        await Election.findById(
          votingToken.electionId
        );

      if (!election) {
        return res.status(404).json({
          status: "error",
          message:
            "Election not found",
        });
      }

      // 4. check election status
      if (
        election.status !==
        "voting_open"
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Election closed",
        });
      }

      // 5. encode vote
      const plaintext =
        encodeVote(
          candidateIndex
        );

      const encryptedVote =
        encrypt(
          plaintext,
          election.paillierPublicKey
        );

      // 6. hash ballot
      const ballotHash =
        crypto
          .createHash("sha256")
          .update(encryptedVote)
          .digest("hex");

      // 7. save ballot
      await Ballot.create({
        electionId:
          votingToken.electionId,

        encryptedVote,
        ballotHash,
      });

      // 8. mark token used
      votingToken.isUsed = true;
      await votingToken.save();

      await writeAudit({

        actorId:
          req.user.userId,

        actorRole:
          "voter",

        electionId,

        action:
          Actions.CAST_VOTE,

        metadata:{
          ballotHash
        }

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