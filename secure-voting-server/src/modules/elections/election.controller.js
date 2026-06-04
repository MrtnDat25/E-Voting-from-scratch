const electionService =
  require("./election.service");

const Election =
  require("./election.model");

const ElectionVoter =
  require("./election-voters/electionVoter.model");

const { nanoid } =
  require("nanoid");

const { ELECTION_STATUS } =
  require("./election.constants");

  console.log(ELECTION_STATUS);

/**
 * CREATE ELECTION
 */
const createElection =
  async (req, res) => {

    try {

      const election =
        await electionService.createElection(
          req.user,
          req.body
        );

      return res.status(201).json({
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

module.exports = {
  createElection,
  getPublicElections,
  joinElection,
  myElection,
  changeStatus,
};