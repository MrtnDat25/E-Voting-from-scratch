const bcrypt =
  require("bcryptjs");

const User =
  require("../../users/user.model");

const ElectionVoter =
  require("./electionVoter.model");

const addVoter =
  async (
    electionId,
    email,
    fullName
  ) => {

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

module.exports = {
  addVoter,
};