const express = require("express");
const router = express.Router();
const EventController = require("../controller/EventController");

// {
//   "title": "A",
//   "description": "Sample event description",
//   "date": "2026-01-15",
//   "time": "10:30:00",
//   "capacity": 100,
//   "booked": 0,
//   "price": 499.99,
//   "status": "PENDING",
//   "active": true
// }

router.post("/", EventController.addEvent);
router.post("/list", EventController.getAllEvent);

// {
//   "filter": {
//     "ids": [1, 2, 3],
//     // "statuses": ["LAUNCHED", "CONFIRMED"],
//     "inActive": true,
//     "startDate": "2026-01-01",
//     "endDate": "2026-01-31",
//     "month": 1,
//     "year": 2026,
//     // "search": "music",
//     "isSkipPagination": false
//   },
//   "sort": {
//     "sortBy": "date",
//     "orderBy": "DESC"
//   },
//   "page": {
//     "pageNumber": 0,
//     "pageLimit": 10
//   }
// }

router.post("/filter", EventController.getEventListByFilterSort);
router.get("/:id", EventController.getEventById);
router.put("/:id", EventController.updateEventById);
router.delete("/:id", EventController.deleteEventById);

module.exports = router;
