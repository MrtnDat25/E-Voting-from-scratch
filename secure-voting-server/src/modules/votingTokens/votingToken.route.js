import express from "express";

const router =
  express.Router();

import auth from 
    "../../middleware/auth.middleware.js"
  ;

import roles from 
    "../../middleware/role.middleware.js"
  ;

import * as controller from "./votingToken.controller.js";

router.post(
  "/request",
  auth,
  roles("voter"),
  controller.requestToken
);

export default router;