import Candidate from "./candidate.model.js";
import User from "../users/user.model.js";
import Election from "../elections/election.model.js";
import bcrypt from "bcryptjs";

const createCandidate = async (data) => {
  const {
    electionId,
    email,
    name,
  } = data;

  const election = await Election.findById(
    electionId
  );

  if (!election) {
    throw new Error("Election not found");
  }

  if (
    election.status !== "draft" &&
    election.status !== "registration_open"
  ) {
    throw new Error(
      "Cannot add candidate. Election is no longer editable."
    );
  }

  let user = await User.findOne({
    email,
  });

  if (!user) {
    const passwordHash = await bcrypt.hash(
      email,
      10
    );

    user = await User.create({
      email,
      fullName: name,
      role: "candidate",
      passwordHash,
    });
  }

  const count =
    await Candidate.countDocuments({
      electionId,
    });

  const candidate =
    await Candidate.create({
      electionId,
      userId: user._id,
      email,
      name,
      candidateIndexOnChain: count,
    });

  return candidate;
};

const getCandidates = async (electionId) => {
  return Candidate.find({
    electionId,
  });
};

export default {
  createCandidate,
  getCandidates,
};