const crypto =
  require("crypto");

const Election =
  require("../elections/election.model");

const ElectionVoter =
  require(
    "../elections/election-voters/electionVoter.model"
  );

const VotingToken =
  require("./votingToken.model");

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
      console.log("electionId:", electionId);
      console.log("userId:", req.user.userIdid);
      const voter =
        await ElectionVoter.findOne({
          electionId,
          voterId:
            req.user.userId ,
        });

      if (!voter) {
        return res.status(403).json({
          status: "error",
          message:
            "Not eligible",
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
        crypto.randomBytes(32)
        .toString("hex");

      await VotingToken.create({
        electionId,
        voterId:
          req.user.id,
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

      return res.json({
        status: "success",
        token,
      });

    } catch (err) {

      return res.status(500).json({
        status: "error",
        message:
          err.message,
      });
    }
  };