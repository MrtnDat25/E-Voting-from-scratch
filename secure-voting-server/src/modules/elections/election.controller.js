const electionService =
  require("./election.service");

const Election =
  require("./election.model");

const ElectionVoter =
  require("./election-voters/electionVoter.model");

const { nanoid } =
  require("nanoid");
  
const createElection =
  async (
    req,
    res
  ) => {

    try {

      const election =
        await electionService.createElection(
          req.user,
          req.body
        );
      let inviteCode = null;

      if (
        electionType === "private"
      ) {
        inviteCode =
          nanoid(8).toUpperCase();
      }
      return res.status(201).json({
        status: "success",

        data: election,
      });

    } catch (err) {

      return res.status(500).json({
        status: "error",

        message:
          err.message,
      });
    }
  };

const getPublicElections =
  async (req, res) => {

    try {

      const elections =
        await Election.find({
          electionType: "public",
          status: {
            $in: [
              "registration_open",
              "voting_open"
            ]
          }
        })
        .populate(
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


const joinElection =
  async (req, res) => {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    try {

      const {
        inviteCode
      } = req.body;

      const election =
        await Election.findOne({
          inviteCode
        });
      console.log("inviteCode:", inviteCode);

      if (!election) {
        return res.status(404).json({
          status: "error",
          message:
            "Invalid invite code"
        });
      }

      const existed =
        await ElectionVoter.findOne({
          electionId:
            election._id,
          voterId:
            req.user.id
        });

      if (existed) {
        return res.status(400).json({
          status: "error",
          message:
            "Already joined"
        });
      }

      await ElectionVoter.create({
        electionId:
          election._id,
          voterId:
          req.user.userId
      });

      return res.json({
        status: "success",
        message:
          "Joined election",
        electionId:
          election._id
      });

    } catch (err) {

      return res.status(500).json({
        status: "error",
        message:
          err.message
      });
    }
  };

const myElection =
  async (req,res) => {
    const links =
      await ElectionVoter.find({
        voterId: req.user.id
      }).populate("electionId")
    
    return res.json({
      status: "success",
      data: links
    });
  };



module.exports = {
  createElection,
  getPublicElections,
  joinElection,
  myElection
};