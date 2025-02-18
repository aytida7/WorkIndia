const pool = require("../config/db");

/**
 * @swagger
 * components:
 *   schemas:
 *     Train:
 *       type: object
 *       required:
 *         - name
 *         - source
 *         - destination
 *         - seats
 *         - time_start
 *         - time_end
 *         - seats_left
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated train ID
 *         name:
 *           type: string
 *         source:
 *           type: string
 *         destination:
 *           type: string
 *         seats:
 *           type: integer
 *         time_start:
 *           type: string
 *           format: date-time
 *         time_end:
 *           type: string
 *           format: date-time
 *         seats_left:
 *           type: integer
 */

/**
 * Adds a new train to the system (Admin only)
 */
const addTrain = async (req, res) => {
    const { name, source, destination, seats, time_start, time_end, seats_left } = req.body;
    const client = await pool.connect(); 

    try {
        //  Starting transaction
        await client.query("BEGIN"); 

        // Check if a train with the same name and time_start already exists in our db
        const existingTrain = await client.query(
            "SELECT * FROM trains WHERE name = $1 AND time_start = $2",
            [name, time_start]
        );

        if (existingTrain.rows.length > 0) {
            // Rollback if the train already exists in db
            await client.query("ROLLBACK"); 
            return res.status(400).json({ message: "Train already exists with the same name and time start" });
        }

        const newTrain = await client.query(
            "INSERT INTO trains (name, source, destination, seats, time_start, time_end, seats_left) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [name, source, destination, seats, time_start, time_end, seats_left]
        );

        // Commit transaction
        await client.query("COMMIT"); 

        res.status(201).json(newTrain.rows[0]); 
    } catch (error) {
        // Rollback if there is an error
        await client.query("ROLLBACK"); 
        console.error("Error adding train:", error);
        res.status(500).json({ message: "Error adding train" });
    } finally {
        // Release connection back to pool
        client.release(); 
    }
};

module.exports = { addTrain };
