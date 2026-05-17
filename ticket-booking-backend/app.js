// check below dependencies are installed or not from package.json or while server run you will get module not found error for these dependencies
// "dependencies": bcrypt, cors, dotenv, exceljs, express, http-status-codes, pg, sequelize, swagger-ui-express, swagger-jsdoc

// if any missing install them via below command
// npm i bcrypt cors http-status-codes

// install below dependencies, 14th Jan, 2026
// npm i exceljs swagger-ui-express swagger-jsdoc

const cors = require("cors");
const express = require("express");
require("dotenv").config();
require("./src/model/index");
const routes = require("./src/route/index");
const errorHandler = require("./src/utils/ErrorHandler");
const swaggerDocs = require("./src/utils/Swagger");

const app = express();
const port = process.env.PORT || 3002;

/// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes); // localhost:3001/users/add
app.use(errorHandler);
swaggerDocs(app, port);

/// server start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
