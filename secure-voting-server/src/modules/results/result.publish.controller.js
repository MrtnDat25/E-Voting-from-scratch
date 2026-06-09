import crypto from "crypto";

import Election
from "../elections/election.model.js";

import ElectionResult
from "./result.model.js";

import { contract }
from "../../blockchain/contract.js";

export const publishResult =
async (req,res)=>{

  try{

    const election =
      await Election.findById(
        req.params.electionId
      );

    if(!election){

      return res.status(404).json({

        status:"error",
        message:
          "Election not found"

      });

    }

    const result =
      await ElectionResult.findOne({

        electionId:
          election._id

      });

    if(!result){

      return res.status(404).json({

        status:"error",
        message:
          "Result not found"

      });

    }

    if(
      !election.chainElectionId
    ){

      return res.status(400).json({

        status:"error",
        message:
          "Missing chainElectionId"

      });

    }

    const resultHash =
      "0x" +
      crypto
      .createHash("sha256")
      .update(
        JSON.stringify(
          result.results
        )
      )
      .digest("hex");

    const tx =
      await contract.publishResult(

        election.chainElectionId,

        resultHash

      );

    const receipt =
      await tx.wait();

    result.blockchain = {

      resultHash,

      txHash:
        receipt.hash

    };

    await result.save();

    election.status =
      "published";

    await election.save();

    return res.json({

      status:"success",

      resultHash,

      txHash:
        receipt.hash

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