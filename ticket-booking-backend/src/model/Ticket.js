const { DataTypes } = require("sequelize");
const db = require("../config/db");
const { SEQUELIZE_CURRENT_TIMESTAMP } = require("../helper/SqlHelper");

const Ticket = db.define("tickets", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    seats: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    softDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: SEQUELIZE_CURRENT_TIMESTAMP
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: SEQUELIZE_CURRENT_TIMESTAMP
    }
},
    { tableName: "tickets" }
);

module.exports = Ticket