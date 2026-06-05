import crypto 
  from "crypto";

import Election 
  from "../elections/election.model.js";

import ElectionVoter 
  from 
    "../elections/election-voters/electionVoter.model.js"
  ;

import VotingToken 
  from "./votingToken.model.js";

import {writeAudit}  
  from "../audit/audit.service.js";

import Actions  from "../../constants/auditActions.js";

exports.requestToken =
  async (req, res) => {

    try {

      const {
        electionId
      } = req.body;

      const election =
        await Election.findById(
          electionId
        );

      if (!election) {
        return res.status(404).json({
          status: "error",
          message:
            "Election not found",
        });
      }

      if (
        election.status !==
        "voting_open"
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Voting is not open",
        });
      }

      console.log(
        "electionId:",
        electionId
      );

      console.log(
        "userId:",
        req.user.userId
      );

      console.log(
        "query =",
        {
          electionId,
          voterId:
            req.user.userId,
        }
      );

      const allVoters =
        await ElectionVoter.find({
          electionId
        });

      console.log(
        JSON.stringify(
          allVoters,
          null,
          2
        )
      );

      let voter =
        await ElectionVoter.findOne({
          electionId,
          voterId:
            req.user.userId,
        });

      console.log(
        "Election type:",
        election.electionType
      );

      if (!voter) {

        if (
          election.electionType ===
          "private"
        ) {

          return res.status(403).json({
            status: "error",
            message:
              "Not eligible for this election",
          });
        }

        voter =
          await ElectionVoter.create({
            electionId,
            voterId:
              req.user.userId,
            isEligible: true,
          });
      }

      if (
        voter.hasRequestedToken
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Token already issued",
        });
      }

      const token =
        crypto
          .randomBytes(32)
          .toString("hex");

      await VotingToken.create({
        electionId,
        voterId:
          req.user.userId,
        token,
        expiresAt:
          new Date(
            Date.now() +
            30 * 60 * 1000
          ),
      });

      voter.hasRequestedToken =
        true;

      await voter.save();

      await writeAudit({

        actorId:
          req.user.userId,

        actorRole:
          "voter",

        electionId,

        action:
          Actions.REQUEST_TOKEN

      });


      return res.json({
        status: "success",
        token,
      });

    } catch (err) {

      console.error(
        "TOKEN ERROR:",
        err
      );

      console.error(
        err.stack
      );

      return res.status(500).json({
        status: "error",
        message:
          err.message,
      });
    }
  };