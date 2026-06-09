import express  from "express";
const router = express.Router();

import * as  controller from"./ballot.controller.js";
import {
  verifyBallot
}
from "./ballot.verify.controller.js";
router.post("/", controller.castVote);
router.get(
  "/verify/:ballotHash",
  verifyBallot
);
export default router;