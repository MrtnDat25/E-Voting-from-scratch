const express = require("express");
const router = express.Router();

const controller = require("./ballot.controller");

router.post("/", controller.castVote);

module.exports = router;