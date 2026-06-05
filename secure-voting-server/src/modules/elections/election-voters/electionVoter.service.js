import bcrypt 
  from "bcryptjs";

import User 
  from "../../users/user.model.js";

import ElectionVoter 
  from "./electionVoter.model.js";

import Election  
  from "../../elections/election.model.js"


const addVoter =
  async (
    electionId,
    email,
    fullName
  ) => {

    const election =
      await Election.findById(
        electionId
      );

    if (!election) {
      throw new Error(
        "Election not found"
      );
    }

    if (
      election.status !== "draft" &&
      election.status !== "registration_open"
    ) {
      throw new Error(
        "Cannot modify voters"
      );
    }
    let voter =
      await User.findOne({
        email,
      });

    if (!voter) {

      const passwordHash =
        await bcrypt.hash(
          email,
          10
        );

      voter =
        await User.create({
          email,

          fullName,

          role: "voter",

          passwordHash,
        });
    }

    const exists =
      await ElectionVoter.findOne({
        electionId,
        voterId: voter._id,
      });

    if (exists) {
      throw new Error(
        "Voter already added"
      );
    }

    return ElectionVoter.create({
      electionId,
      voterId: voter._id,
    });
  };

  const removeVoter = async (id) => {

    const voter =
      await ElectionVoter.findById(id);

    if (!voter) {
      throw new Error(
        "Voter not found"
      );
    }

    const election =
      await Election.findById(
        voter.electionId
      );

    if (
      election.status !== "draft" &&
      election.status !== "registration_open"
    ) {
      throw new Error(
        "Cannot modify voters"
      );
    }

    await ElectionVoter.findByIdAndDelete(
      id
    );
  };

export default {
  addVoter,
  removeVoter,
};