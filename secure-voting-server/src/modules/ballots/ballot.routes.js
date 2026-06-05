import express  from "express";
const router = express.Router();

import * as  controller from"./ballot.controller.js";

router.post("/", controller.castVote);

export default router;