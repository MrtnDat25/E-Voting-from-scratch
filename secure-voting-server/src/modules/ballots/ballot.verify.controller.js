import Ballot
from "./ballot.model.js";

import { contract }
from "../../blockchain/contract.js";

export const verifyBallot =
async (req,res)=>{

  try{

    const {
      ballotHash
    } = req.params;

    const ballot =
      await Ballot.findOne({

        "blockchain.ballotHash":
          ballotHash

      });

    if(!ballot){

      return res.status(404).json({

        status:"error",

        message:
          "Ballot not found"

      });

    }

    const existsOnChain =
      await contract.ballotHashes(
        ballotHash
      );

    return res.json({

      status:"success",

      verified:
        existsOnChain,

      ballotHash,

      txHash:
        ballot.blockchain.txHash

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