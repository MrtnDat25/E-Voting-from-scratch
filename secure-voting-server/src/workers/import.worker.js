const { Worker } = require("bullmq");
const XLSX = require("xlsx");
const bcrypt = require("bcryptjs");

const User = require("../modules/users/user.model");
const Election = require("../modules/elections/election.model");
const ElectionVoter = require("../modules/election-voters/electionVoter.model");

const connection = require("../config/redis");

new Worker(
  "import-voters",
  async (job) => {
    const { filePath, electionId } = job.data;

    const election = await Election.findById(electionId);
    if (!election) throw new Error("Election not found");

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // ===== normalize emails
    const emails = rows
      .map(r => (r.email || r.Email || r.EMAIL))
      .filter(Boolean)
      .map(e => e.toLowerCase().trim());

    // ===== existing users
    const existingUsers = await User.find({
      email: { $in: emails },
    });

    const userMap = new Map(
      existingUsers.map(u => [u.email, u])
    );

    // ===== create missing users
    const newUsers = [];

    for (const email of emails) {
      if (!userMap.has(email)) {
        newUsers.push({
          email,
          fullName: email.split("@")[0],
          role: "voter",
          passwordHash: await bcrypt.hash(email, 10),
        });
      }
    }

    const createdUsers = await User.insertMany(newUsers, {
      ordered: false,
    });

    createdUsers.forEach(u => {
      userMap.set(u.email, u);
    });

    // ===== build voter docs
    const voterDocs = emails.map(email => ({
      electionId,
      voterId: userMap.get(email)._id,
    }));

    // ===== insert voters
    await ElectionVoter.insertMany(voterDocs, {
      ordered: false,
    });

    return {
      success: true,
      total: emails.length,
    };
  },
  { connection }
);