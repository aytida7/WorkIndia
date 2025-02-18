const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated user ID
 *         username:
 *           type: string
 *         password:
 *           type: string
 *           description: Hashed password
 *         role:
 *           type: string
 *           enum: [user, admin]
 */

/**
 * Registers a new user with transaction handling
 */
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const client = await pool.connect(); 

    try {
        await client.query("BEGIN"); 

        // Check if the username already exists
        const existingUser = await client.query("SELECT * FROM users WHERE username = $1 FOR UPDATE", [username]);

        if (existingUser.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const newUser = await client.query(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
            [username, hashedPassword, role]
        );

        await client.query("COMMIT");

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user" });
    } finally {
        client.release();
    }
};

/**
 * Logs in a user and generates a JWT token
 */
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) return res.status(400).json({ message: "Invalid Credentials" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Login error" });
    }
};

module.exports = { registerUser, loginUser };
