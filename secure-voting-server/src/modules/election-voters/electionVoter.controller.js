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

module.exports = {
  addVoter,
};