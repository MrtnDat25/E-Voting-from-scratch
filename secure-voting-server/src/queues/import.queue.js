const { Queue } = require("bullmq");
const connection = require("../config/redis");

const importQueue = new Queue("import-voters", {
  connection,
});

module.exports = importQueue;