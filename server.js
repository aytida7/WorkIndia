const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const app = express();
app.use(express.json());

// This is for Swagger authorization section
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Railway Management API",
            version: "1.0.0",
            description: "API documentation for the railway management system",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Development Server",
            },
        ],
        components: {
            securitySchemes: {
                // bearerAuth: { // For API Key authentication in the header
                //     type: "apiKey",
                //     in: "header",  // The API Key will be passed in the header
                //     name: "Authorization",  // Name of the header for JWT or API Key
                //     description: "Enter your JWT token or API key directly, without 'Bearer ' prefix.",
                // },
                apiKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key", // API key passed in the header
                    description: "Enter your API key in the x-api-key header.",
                },
            },
        },
        security: [
            {
                bearerAuth: [],  // JWT token or API key required here
            },
            {
                apiKeyAuth: [], // For routes that require API key
            },
        ],
    },
    apis: ["./routes/*.js"],  
};


// Swagger endpoints
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Main routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/trains", require("./routes/trainRoutes"));
app.use("/bookings", require("./routes/bookingRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
