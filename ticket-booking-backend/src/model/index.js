const db = require("../config/db");
const User = require("../model/User");
const Event = require("../model/Event");
const Ticket = require("../model/Ticket");

/// Associations
// EVENT → TICKET
Event.hasMany(Ticket, { foreignKey: "eventId", as: "tickets", constraints: false });
Ticket.belongsTo(Event, { foreignKey: "eventId", as: "event", constraints: false });
// USER → TICKET
User.hasMany(Ticket, { foreignKey: "userId", as: "tickets", constraints: false });
Ticket.belongsTo(User, { foreignKey: "userId", as: "user", constraints: false });

/// DB Sync
db.sync({ alter: true })
    .then(() => {
        console.log("Database synced successfully!");
    })
    .catch((err) => {
        console.error("Error syncing database: ", err);
    });

module.exports = {
    db
};
