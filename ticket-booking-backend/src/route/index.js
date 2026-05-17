const express = require("express");
const router = express.Router();

// All routes file imported here
const userRoute = require("./UserRoute");
const eventRoute = require("./EventRoute");
const ticketRoute = require("./TicketRoute")

// check health
router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// All routes file uses here
router.use("/users", userRoute);
router.use("/events", eventRoute);
router.use("/tickets", ticketRoute);

// POST localhost:3001/events/
// /users/add
// /users/login

module.exports = router;
