const service =
  require("./candidate.service");

const Election =
  require("../elections/election.model");

const { writeAudit } =
  require("../audit/audit.service");

const Actions =
  require("../../constants/auditActions");

const createCandidate =
  async (req, res) => {

    try {

      const election =
        await Election.findById(req.body.electionId);

      if (!election) {
        return res.status(404).json({
          status: "error",
          message: "Election not found",
        });
      }

      if (
        !["draft", "registration_open"].includes(election.status)
      ) {
        return res.status(400).json({
          status: "error",
          message: "Cannot add candidate now",
        });
      }

      const candidate =
        await service.createCandidate(req.body);

      await writeAudit({
        actorId: req.user.userId,
        actorRole: req.user.role,
        electionId: req.body.electionId,
        action: Actions.ADD_CANDIDATE,
        metadata: {
          candidate: candidate.name,
        },
      });

      return res.status(201).json({
        status: "success",
        data: candidate,
      });

    } catch (err) {

      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  };

const getCandidates =
  async (req, res) => {
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