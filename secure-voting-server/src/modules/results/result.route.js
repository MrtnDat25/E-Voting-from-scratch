import express  from "express";

const router = express.Router();

import * as controller  from "./result.controller.js";
import {
  publishResult
}
  from "./result.publish.controller.js";

import {
  verifyResult
}
  from "./result.verify.controller.js";

router.get("/:electionId", controller.getResult);
router.get(
  "/:electionId/verify",
  verifyResult
);

export default router;