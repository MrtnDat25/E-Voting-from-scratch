import express from "express";

const router = express.Router();

import controller from "./electionVoter.controller.js";
import * as importController from "./electionVoter.import.controller.js";

import auth from "../../../middleware/auth.middleware.js";
import roles from "../../../middleware/role.middleware.js";

/* =========================
   ROUTES
========================= */

// Add single voter
router.post(
  "/",
  auth,
  roles("company"),
  controller.addVoter
);

// Import voters from Excel
router.post(
  "/import",
  auth,
  roles("company"),
  importController.importVoters
);

// Get voters by election
router.get(
  "/:electionId",
  auth,
  controller.getElectionVoters
);

// Remove voter
router.delete(
  "/:id",
  auth,
  roles("company"),
  controller.removeVoter
);

export default router;

/* =========================
   SWAGGER DOCS
========================= */

/**
 * @swagger
 * components:
 *   schemas:
 *     VoterUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: voter@example.com
 *         fullName:
 *           type: string
 *           example: Nguyen Van A
 *
 *     ElectionVoter:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65a123abc456def789000111
 *
 *         electionId:
 *           type: string
 *           example: 65a123abc456def789000222
 *
 *         voterId:
 *           $ref: '#/components/schemas/VoterUser'
 *
 *         isEligible:
 *           type: boolean
 *           example: true
 *
 *         votingTokenHash:
 *           type: string
 *           nullable: true
 *
 *         hasVoted:
 *           type: boolean
 *           example: false
 *
 *         votedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *         blockchainBallotHash:
 *           type: string
 *           nullable: true
 *
 *         blockchainTxHash:
 *           type: string
 *           nullable: true
 *
 *         registeredAt:
 *           type: string
 *           format: date-time
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /voters:
 *   post:
 *     summary: Add single voter to election
 *     tags: [ElectionVoters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - electionId
 *               - email
 *               - fullName
 *             properties:
 *               electionId:
 *                 type: string
 *                 example: 65a123abc456def789000222
 *               email:
 *                 type: string
 *                 example: voter@gmail.com
 *               fullName:
 *                 type: string
 *                 example: Nguyen Van A
 *     responses:
 *       201:
 *         description: Voter added successfully
 */

/**
 * @swagger
 * /voters/import:
 *   post:
 *     summary: Import voters from Excel file
 *     tags: [ElectionVoters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - electionId
 *               - file
 *             properties:
 *               electionId:
 *                 type: string
 *                 example: 65a123abc456def789000222
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 inserted:
 *                   type: integer
 *                 duplicated:
 *                   type: integer
 *                 createdUsers:
 *                   type: integer
 */

/**
 * @swagger
 * /voters/{electionId}:
 *   get:
 *     summary: Get all voters in election
 *     tags: [ElectionVoters]
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
 *         description: List of voters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ElectionVoter'
 */

/**
 * @swagger
 * /voters/{id}:
 *   delete:
 *     summary: Remove voter from election
 *     tags: [ElectionVoters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voter removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Voter removed
 */