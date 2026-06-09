import { contract }
from "../../blockchain/contract.js";

import ElectionResult from "../results/result.model.js";

export const verifyElection =
async (req,res)=>{

  try{

    const electionId =
      req.params.id;

    const chainElection =
      await contract.getElection(
        electionId
      );

    return res.json({

      status:"success",

      data:{
        electionId:
          chainElection[0].toString(),

        company:
          chainElection[1],

        electionHash:
          chainElection[2],

        resultHash:
          chainElection[3],

        closed:
          chainElection[4]
      }

    });

  }
  catch(err){

    return res.status(500).json({

      status:"error",
      message:err.message

    });

  }

};

export const verifyResult =
async (req,res)=>{

  try{

    const result =
      await ElectionResult.findOne({

        electionId:
          req.params.electionId

      });

    if(!result){

      return res.status(404).json({

        status:"error",

        message:
          "Result not found"

      });

    }

    return res.json({

      status:"success",

      blockchain:
        result.blockchain

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