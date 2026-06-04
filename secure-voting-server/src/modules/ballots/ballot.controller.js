const crypto =
  require("crypto");

const Ballot =
  require("./ballot.model");

const VotingToken =
  require(
    "../votingTokens/votingToken.model"
  );

exports.castVote =
  async (req, res) => {

    try {

      const {
        token,
        candidateIndex
      } = req.body;

      const votingToken =
        await VotingToken.findOne({
          token,
          status:"active",
        });

      if (!votingToken) {
        return res.status(400).json({
          status: "error",
          message:
            "Invalid token",
        });
      }

      // encrypt vote
      const plaintext =
      encodeVote(
        candidateIndex
      );
      const encryptedVote =
      encrypt(
        plaintext,
        election
          .paillierPublicKey
      );

      const ballotHash =
        crypto
        .createHash("sha256")
        .update(
          encryptedVote
        )
        .digest("hex");

      await Ballot.create({
        electionId:
          votingToken.electionId,

        encryptedVote,

        ballotHash,

        voterTokenId:
          votingToken._id,
      });

      votingToken.isUsed =
        true;

      await votingToken.save();

      return res.json({
        status: "success",
        ballotHash,
      });

    } catch (err) {

      return res.status(500).json({
        status: "error",
        message:
          err.message,
      });
    }
  };