const electionService =
  require("./election.service");

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

module.exports = {
  createElection,
};