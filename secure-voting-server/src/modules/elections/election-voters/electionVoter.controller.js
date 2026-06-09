import service from "./electionVoter.service.js";
import ElectionVoter from "./electionVoter.model.js";

import { writeAudit } from "../../audit/audit.service.js";
import Actions from "../../../constants/auditActions.js";

const addVoter = async (req, res) => {
  try {
    const result = await service.addVoter(
      req.body.electionId,
      req.body.email,
      req.body.fullName
    );

    await writeAudit({
      actorId: req.user.userId,
      actorRole: req.user.role,
      electionId: req.body.electionId,
      action: Actions.ADD_VOTER,
      metadata: {
        voterId: result.voterId,
      },
    });

    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

const getElectionVoters = async (req, res) => {
  try {
    const { electionId } = req.params;

    const voters = await ElectionVoter.find({
      electionId,
    }).populate("voterId", "email fullName");

    return res.json({
      status: "success",
      data: voters,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const removeVoter = async (req, res) => {
  try {
    await service.removeVoter(req.params.id);

    return res.json({
      status: "success",
      message: "Voter removed",
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export default {
  addVoter,
  getElectionVoters,
  removeVoter,
};