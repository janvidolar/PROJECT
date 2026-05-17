const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

// Adjust the options with your Swagger definition
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "REST API for Ticket Booking",
            version: "1.0.0",
            description: "This is the REST API for Ticket Booking",
        }
    },
    apis: ["./src/api-docs/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app, port) {
    app.use(
        "/swagger-ui/index.html",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            swaggerOptions: {
                docExpansion: "none",
                defaultModelsExpandDepth: -1,
                defaultModelRendering: "schema",
                displayRequestDuration: true,
                showExtensions: true,
                showCommonExtensions: true,
            },
            customSiteTitle: "Ticket Booking Documentation",
        }),
    );

    console.log(
        `Swagger initiated at http://localhost:${port}/swagger-ui/index.html`,
    );
}

module.exports = swaggerDocs;
