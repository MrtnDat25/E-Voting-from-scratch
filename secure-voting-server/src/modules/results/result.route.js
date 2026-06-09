import express  from "express";

const router = express.Router();

import * as controller  from "./result.controller.js";
import {
  publishResult
}
  from "./result.publish.controller.js";

import auth 
  from
    "../../middleware/auth.middleware.js"
  ;

import roles 
  from
    "../../middleware/role.middleware.js"
  ;
import {
  verifyResult
}
  from "./result.verify.controller.js";
import {
  exportResultExcel
}
from "./result.export.controller.js";
router.get("/:electionId", controller.getResult);
router.get(
  "/:electionId/verify",
  verifyResult
);
router.get(
  "/:electionId/export",
  auth,
  roles("company"),
  exportResultExcel
);

export default router;