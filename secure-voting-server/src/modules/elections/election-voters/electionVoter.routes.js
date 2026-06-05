import express from "express";

const router =
  express.Router();

import auth 
  from 
    "../../../middleware/auth.middleware.js"
  ;

import roles 
  from 
    "../../../middleware/role.middleware.js"
  ;

import controller 
  from 
    "./electionVoter.controller.js"
  ;

import * as importController from "./electionVoter.import.controller.js";
  ;

// add 1 voter
router.post(
  "/",
  auth,
  roles("company"),
  controller.addVoter
);

// import excel
router.post(
  "/import",
  auth,
  roles("company"),
  importController.importVoters
);

router.get(
  "/:electionId",
  auth,
  controller.getElectionVoters
);

router.delete(
  "/:id",
  auth,
  roles("company"),
  controller.removeVoter
);

export default router;