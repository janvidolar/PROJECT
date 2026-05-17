const { DataTypes } = require("sequelize");
const db = require("../config/db");
const { SEQUELIZE_CURRENT_TIMESTAMP } = require("../helper/SqlHelper");
// ticket_booking: table name

// cases
// full_name
// fullName
// FULLNAME
// FULL_NAME

const Event = db.define("events", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    booked: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('LAUNCHED', 'CANCELLED', 'CONFIRMED', 'PENDING'),
        allowNull: true,
        defaultValue: 'PENDING'
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    { tableName: "events" }
);

module.exports = Event