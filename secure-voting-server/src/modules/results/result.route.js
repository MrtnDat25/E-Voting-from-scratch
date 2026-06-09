import express from "express";

const router = express.Router();

import * as controller from "./result.controller.js";
import { publishResult } from "./result.publish.controller.js";
import { verifyResult } from "./result.verify.controller.js";
import { exportResultExcel } from "./result.export.controller.js";

import auth from "../../middleware/auth.middleware.js";
import roles from "../../middleware/role.middleware.js";

/* =========================
   ROUTES
========================= */

router.get("/:electionId", controller.getResult);

router.get("/:electionId/verify", verifyResult);

router.get(
  "/:electionId/export",
  auth,
  roles("company"),
  exportResultExcel
);

router.post(
  "/:electionId/publish",
  auth,
  roles("company"),
  publishResult
);

export default router;

/* =========================
   SWAGGER DOCS
========================= */

/**
 * @swagger
 * components:
 *   schemas:
 *     ResultCandidate:
 *       type: object
 *       properties:
 *         candidateId:
 *           type: string
 *         votes:
 *           type: integer
 *
 *     ElectionResult:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *
 *         electionId:
 *           type: string
 *
 *         encryptedTotal:
 *           type: string
 *
 *         decryptedTotal:
 *           type: string
 *
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ResultCandidate'
 *
 *         winnerCandidateId:
 *           type: string
 *           nullable: true
 *
 *         blockchain:
 *           type: object
 *           properties:
 *             resultHash:
 *               type: string
 *             txHash:
 *               type: string
 *
 *         publishedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /results/{electionId}:
 *   get:
 *     summary: Get election result
 *     tags: [Results]
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Result fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ElectionResult'
 */

/**
 * @swagger
 * /results/{electionId}/verify:
 *   get:
 *     summary: Verify result with blockchain
 *     tags: [Results]
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 verified:
 *                   type: boolean
 *                 localHash:
 *                   type: string
 *                 blockchainHash:
 *                   type: string
 */

/**
 * @swagger
 * /results/{electionId}/export:
 *   get:
 *     summary: Export election result to Excel
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Excel file downloaded
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */

/**
 * @swagger
 * /results/{electionId}/publish:
 *   post:
 *     summary: Publish result to blockchain
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Result published successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 resultHash:
 *                   type: string
 *                 txHash:
 *                   type: string
 */