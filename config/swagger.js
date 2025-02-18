const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger configuration
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Railway Management System API",
            version: "1.0.0",
            description: "API documentation for the Railway Management System",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local server",
            },
        ],
    },
    apis: ["./routes/*.js"], 
};

// this is for swaggerdocs
const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Swagger docs available at http://localhost:5000/api-docs");
};

module.exports = swaggerDocs;
