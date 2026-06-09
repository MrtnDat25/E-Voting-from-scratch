import express from "express";

const router = express.Router();

import auth from "../../middleware/auth.middleware.js";
import roles from "../../middleware/role.middleware.js";

import {
  getCompanyDashboard,
  getVoterDashboard,
} from "./dashboard.controller.js";

/* =========================
   ROUTES
========================= */

// COMPANY DASHBOARD
router.get(
  "/company",
  auth,
  roles("company"),
  getCompanyDashboard
);

// VOTER DASHBOARD
router.get(
  "/voter",
  auth,
  roles("voter"),
  getVoterDashboard
);

export default router;

/* =========================
   SWAGGER DOCS
========================= */

/**
 * @swagger
 * components:
 *   schemas:
 *     LatestElection:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         status:
 *           type: string
 *         electionType:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CompanyDashboard:
 *       type: object
 *       properties:
 *         totalElections:
 *           type: integer
 *         activeElections:
 *           type: integer
 *         totalVotes:
 *           type: integer
 *         publishedResults:
 *           type: integer
 *         drafts:
 *           type: integer
 *         votingOpen:
 *           type: integer
 *         published:
 *           type: integer
 *         latestElections:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LatestElection'
 *
 *     VoterElection:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         electionId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             status:
 *               type: string
 *
 *     VoterDashboard:
 *       type: object
 *       properties:
 *         joined:
 *           type: integer
 *         voted:
 *           type: integer
 *         requestedTokens:
 *           type: integer
 *         myElections:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VoterElection'
 */

/**
 * @swagger
 * /dashboard/company:
 *   get:
 *     summary: Company dashboard stats
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/CompanyDashboard'
 */

/**
 * @swagger
 * /dashboard/voter:
 *   get:
 *     summary: Voter dashboard stats
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Voter dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/VoterDashboard'
 */