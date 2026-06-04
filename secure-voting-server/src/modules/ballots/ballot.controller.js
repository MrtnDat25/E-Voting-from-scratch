const crypto =
  require("crypto");

const Ballot =
  require("./ballot.model");

const VotingToken =
  require(
    "../votingTokens/votingToken.model"
  );

const Election =
  require(
    "../elections/election.model"
  );

const {
  encodeVote
} =
  require(
    "../../services/paillier/encode"
  );

const {
  encrypt
} =
  require(
    "../../services/paillier/encrypt"
  );

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