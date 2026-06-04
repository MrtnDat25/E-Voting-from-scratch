const express = require("express");

const router = express.Router();

const controller = require("./result.controller");

router.get("/:electionId", controller.getResult);

module.exports = router;