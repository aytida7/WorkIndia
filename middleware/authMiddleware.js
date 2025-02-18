const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * Middleware to verify JWT token
 */
const verifyToken = (req, res, next) => {
   
    const token = req.header('Authorization')?.replace('Bearer ', '');  // remove 'Bearer ' prefix if it exists
    
    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};



const verifyAdminKey = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    console.log("apiKey",apiKey)
    if (apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ message: 'Unauthorized Admin Access' });
    }
    next();
};

module.exports = { verifyToken, verifyAdminKey };
