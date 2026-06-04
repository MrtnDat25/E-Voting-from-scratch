const service =
  require("./candidate.service");

const Election = 
  require("../elections/election.model")


const createCandidate =
  async (
    req,
    res
  ) => {

    try {

      const candidate =
        await service.createCandidate(
          req.body
        );

      return res.status(201).json({
        status: "success",
        data: candidate,
      });

    } catch (err) {

      return res.status(500).json({
        status: "error",
        message:
          err.message,
      });
    }
  };

  
const getCandidates = async (req, res) => {
  try {
    const candidates =
      await service.getCandidates(
        req.query.electionId
      );

    return res.json({
      status: "success",
      data: candidates,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = {
  createCandidate,
  getCandidates,
};