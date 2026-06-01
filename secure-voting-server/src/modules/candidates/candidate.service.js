const Candidate =
  require("./candidate.model");

const User =
  require(
    "../users/user.model"
  );

const bcrypt =
  require("bcryptjs");

const createCandidate =
  async (data) => {

    const {
      electionId,
      email,
      name,
    } = data;

    let user =
      await User.findOne({
        email,
      });

    if (!user) {

      const passwordHash =
        await bcrypt.hash(
          email,
          10
        );

      user =
        await User.create({
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

        candidateIndexOnChain:
          count,
      });

    return candidate;
  };


const getCandidates =
  async (electionId) => {

    return Candidate.find({
      electionId,
    });
  };

module.exports = {
  createCandidate,
  getCandidates,
};


module.exports = {
  createCandidate,
};