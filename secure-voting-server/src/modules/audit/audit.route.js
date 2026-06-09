import express from "express";

const router = express.Router();

import auth
from "../../middleware/auth.middleware.js";

import roles
from "../../middleware/role.middleware.js";

import * as controller
from "./audit.controller.js";

router.get(
  "/election/:electionId",
  auth,
  roles("company"),
  controller.getLogs
);

export default router;