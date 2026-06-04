  const service =
    require("./electionVoter.service");

  const addVoter =
    async (req, res) => {

      try {

        const result =
          await service.addVoter(
            req.body.electionId,
            req.body.email,
            req.body.fullName
          );

        res.status(201).json({
          status: "success",
          data: result,
        });

      } catch (err) {

        res.status(400).json({
          status: "error",
          message:
            err.message,
        });
      }
    };

  const getElectionVoters = async (req, res) =>{

    const { electionId } =
      req.params;

    const voters =
      await ElectionVoter.find({
        electionId
      })
      .populate(
        "voterId",
        "email fullName"
      );

    return res.json({
      status:"success",
      data:voters
    });
  };

  const removeVoter = async (req, res) => {
    try {
      await service.removeVoter(req.params.id);

      return res.json({
        status: "success",
        message: "Voter removed"
      });

    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: err.message
      });
    }
  };
module.exports = {
  addVoter,
  getElectionVoters,
  removeVoter
  };