const { Sequelize } = require("sequelize");

const SEQUELIZE_CURRENT_TIMESTAMP = Sequelize.literal('CURRENT_TIMESTAMP')

module.exports = {
    SEQUELIZE_CURRENT_TIMESTAMP
}