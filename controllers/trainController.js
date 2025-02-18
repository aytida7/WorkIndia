const pool = require("../config/db");

const searchTrains = async (req, res) => {
    const { source, destination } = req.query;

    if (!source || !destination) {
        return res.status(400).json({ message: "Source and destination are required" });
    }

    const client = await pool.connect(); 

    try {
        await client.query("BEGIN"); 

        const trains = await client.query(
            "SELECT * FROM trains WHERE source = $1 AND destination = $2",
            [source, destination]
        );

        await client.query("COMMIT"); 

        res.json(trains.rows);
    } catch (error) {
        await client.query("ROLLBACK"); 
        console.error("Error searching trains:", error);
        res.status(500).json({ message: "Error searching trains" });
    } finally {
        // Release connection back to pool after used
        client.release(); 
    }
};

module.exports = { searchTrains };
