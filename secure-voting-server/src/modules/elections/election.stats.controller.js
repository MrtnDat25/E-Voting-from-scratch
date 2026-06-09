import Election
from "./election.model.js";

import ElectionVoter
from "./election-voters/electionVoter.model.js";

import VotingToken
from "../votingTokens/votingToken.model.js";

import Ballot
from "../ballots/ballot.model.js";
import ElectionResult
from "../results/result.model.js";
import Candidate
from "../candidates/candidate.model.js";
export const getElectionStats =
async (req,res)=>{

  try{

    const election =
      await Election.findById(
        req.params.id
      );

    if(!election){

      return res.status(404).json({

        status:"error",

        message:
          "Election not found"

      });

    }

    const registered =
      await ElectionVoter.countDocuments({

        electionId:
          election._id

      });

    const tokensIssued =
      await VotingToken.countDocuments({

        electionId:
          election._id

      });

    const voted =
      await Ballot.countDocuments({

        electionId:
          election._id

      });

    const totalCandidates =
    await Candidate.countDocuments({

        electionId:
        election._id

    });

    const result =
    await ElectionResult
    .findOne({

        electionId:
        election._id

    })
    .populate(
        "winnerCandidateId"
    );
    const turnout =
      registered === 0
      ? 0
      :
      (
        voted /
        registered
      ) * 100;

    
        return res.json({

        status:"success",

        data:{

            electionId:
            election._id,

            title:
            election.title,

            status:
            election.status,

            electionType:
            election.electionType,

            totalCandidates,

            registered,

            tokensIssued,

            voted,

            turnout:
            turnout.toFixed(2) + "%",

            published:
            !!result,

            winner:
            result?.winnerCandidateId
            ? {

                id:
                    result
                    .winnerCandidateId
                    ._id,

                name:
                    result
                    .winnerCandidateId
                    .name,

                email:
                    result
                    .winnerCandidateId
                    .email

                }
            : null

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