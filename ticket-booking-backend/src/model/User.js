const db = require("../config/db");
const { DataTypes } = require("sequelize");
const { SEQUELIZE_CURRENT_TIMESTAMP } = require("../helper/SqlHelper");

const User = db.define(
    'users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user"
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    softDelete: {
        type: DataTypes.BOOLEAN,
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
}, {
    tableName: 'users',
    indexes: [
        {
            unique: true,
            name: 'users_email_unique',
            fields: ['email'],
            where: { softDelete: false },
        }
    ]
})

module.exports = User;