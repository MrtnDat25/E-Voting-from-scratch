import express from "express";

const router =
express.Router();

import auth
from "../middleware/auth.middleware.js";

import {
  verifyElection,
  verifyResult
}
from "./blockchain.controller.js";

router.get(
  "/election/:id",
  auth,
  verifyElection
);

router.get(
  "/result/:electionId",
  auth,
  verifyResult
);

export default router;