import electionService 
  from "./election.service.js";

import Election 
  from "./election.model.js";

import ElectionVoter 
  from "./election-voters/electionVoter.model.js";

import { nanoid } 
  from "nanoid";

import ELECTION_STATUS from "./election.constants.js";

  console.log(ELECTION_STATUS); 

import crypto  from "crypto";
import { contract } from "../../blockchain/contract.js";

import { ethers } from "ethers";


import {
  writeAudit,
}  from "../audit/audit.service.js";
import Actions 
  from "../../constants/auditActions.js";


import VotingToken
from "../votingTokens/votingToken.model.js";

import Ballot
from "../ballots/ballot.model.js";
/**
 * CREATE ELECTION
 */
const createElection = async (req, res) => {
  try {
    // 1. Tạo election trong MongoDB
    const election = await electionService.createElection(
      req.user,
      req.body
    );

    // 2. Sinh electionId cho blockchain
    const chainElectionId = BigInt(
      "0x" + crypto.randomBytes(8).toString("hex")
    );

    // 3. Tạo hash dữ liệu election
    const electionHash = ethers.keccak256(
      ethers.toUtf8Bytes(
        JSON.stringify({
          title: election.title,
          description: election.description,
          startTime: election.startTime,
          endTime: election.endTime,
          companyId: election.companyId,
        })
      )
    );

    // 4. Ghi blockchain
    const tx = await contract.createElection(
      chainElectionId,
      electionHash
    );

    const receipt = await tx.wait();

    // 5. Lưu thông tin blockchain
    election.chainElectionId =
      chainElectionId.toString();

    election.blockchainTxHash =
      tx.hash;

    election.electionHashOnChain =
      electionHash;

    election.blockchain = {
      electionHash,
      txHash: tx.hash,
    };

    await election.save();

    // 6. Audit log
    await writeAudit({
      actorId: req.user.userId,
      actorRole: req.user.role,
      electionId: election._id,
      action: Actions.CREATE_ELECTION,
      metadata: {
        title: election.title,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
      },
    });

    return res.status(201).json({
      status: "success",
      data: election,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

/**
 * GET PUBLIC ELECTIONS
 */
const getPublicElections =
  async (req, res) => {

    try {

      const elections =
        await Election.find({
          electionType: "public",
          status: {
            $in: [
              ELECTION_STATUS.REGISTRATION_OPEN,
              ELECTION_STATUS.VOTING_OPEN,
            ],
          },
        }).populate(
          "companyId",
          "fullName email"
        );

      return res.json({
        status: "success",
        data: elections,
      });

    } catch (err) {

      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  };

/**
 * JOIN ELECTION
 */
const joinElection =
  async (req, res) => {

    try {

      const { inviteCode } =
        req.body;

      const election =
        await Election.findOne({
          inviteCode,
        });

      if (!election) {
        return res.status(404).json({
          status: "error",
          message:
            "Invalid invite code",
        });
      }

      // chỉ cho join khi registration_open
      if (
        election.status !==
        ELECTION_STATUS.REGISTRATION_OPEN
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Cannot join election now",
        });
      }

      const existed =
        await ElectionVoter.findOne({
          electionId: election._id,
          voterId: req.user.userId,
        });

      if (existed) {
        return res.status(400).json({
          status: "error",
          message:
            "Already joined",
        });
      }

      await ElectionVoter.create({
        electionId: election._id,
        voterId: req.user.userId,
      });

      return res.json({
        status: "success",
        message:
          "Joined election",
        electionId: election._id,
      });

    } catch (err) {

      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  };

/**
 * MY ELECTION
 */
const myElection =
  async (req, res) => {

    try {

      const links =
        await ElectionVoter.find({
          voterId: req.user.userId,
        }).populate("electionId");

      return res.json({
        status: "success",
        data: links,
      });

    } catch (err) {

      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  };

/**
 * CHANGE STATUS (SAFE VERSION)
 */
const changeStatus =
  async (req, res) => {

    try {

      const election =
        await Election.findById(
          req.params.id
        );

      if (!election) {
        return res.status(404).json({
          status: "error",
          message:
            "Election not found",
        });
      }

      const allowed =
        Object.values(ELECTION_STATUS);

      if (
        !allowed.includes(
          req.body.status
        )
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Invalid status",
        });
      }

      election.status =
        req.body.status;

      await election.save();

      return res.json({
        status: "success",
        data: election,
      });

    } catch (err) {

      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  };

export const getElectionStats =
async (req,res)=>{

  try{

    const electionId =
      req.params.id;

    const totalVoters =
      await ElectionVoter.countDocuments({
        electionId
      });

    const requestedTokens =
      await ElectionVoter.countDocuments({
        electionId,
        hasRequestedToken:true
      });

    const voted =
      await ElectionVoter.countDocuments({
        electionId,
        hasVoted:true
      });

    const turnoutRate =
      totalVoters === 0
      ? 0
      : (
          voted /
          totalVoters *
          100
        ).toFixed(2);

    return res.json({

      status:"success",

      data:{

        totalVoters,

        requestedTokens,

        voted,

        turnoutRate

      }

    });

  }
  catch(err){

    return res.status(500).json({

      status:"error",

      message:
        err.message

    });

  }

};

export default {
  createElection,
  getPublicElections,
  joinElection,
  myElection,
  changeStatus,
  getElectionStats
};