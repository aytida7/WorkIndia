const express = require("express");
const { searchTrains } = require("../controllers/trainController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trains
 *   description: Train search and management
 */

/**
 * @swagger
 * /trains/search:
 *   get:
 *     summary: Search for trains by source and destination
 *     tags: [Trains]
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         required: true
 *         description: Source station name
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         required: true
 *         description: Destination station name
 *     responses:
 *       200:
 *         description: List of matching trains
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Express 123
 *                   source:
 *                     type: string
 *                     example: New York
 *                   destination:
 *                     type: string
 *                     example: Boston
 *                   seats:
 *                     type: integer
 *                     example: 200
 *                   time_start:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-17 14:30:00+05:30"
 *                   time_end:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-17 14:30:00+05:30"
 *                   seats_left:
 *                     type: integer
 *                     example: 150
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.get("/search", searchTrains);

module.exports = router;
