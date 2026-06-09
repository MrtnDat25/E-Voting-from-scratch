import express from "express";

const router = express.Router();

import auth from "../../middleware/auth.middleware.js";

import roles from "../../middleware/role.middleware.js";

import {
getCompanyDashboard,
getVoterDashboard
} from "./dashboard.controller.js";

router.get(
"/company",
auth,
roles("company"),
getCompanyDashboard
);

router.get(
"/voter",
auth,
roles("voter"),
getVoterDashboard
);

export default router;