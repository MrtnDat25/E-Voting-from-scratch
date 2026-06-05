import express  from "express";

const router = express.Router();

import * as controller  from "./result.controller.js";

router.get("/:electionId", controller.getResult);

export default router;