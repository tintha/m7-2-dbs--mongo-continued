const router = require("express").Router();
const {
  getSeats,
  bookSeat,
  deleteBooking,
  updateCustomer,
} = require("./handlers");

("use strict");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

router.get("/api/seat-availability", getSeats);

router.post("/api/book-seat/", bookSeat);

router.delete("/api/delete-booking/:seatId", deleteBooking);

router.put("/api/update-customer/", updateCustomer);

module.exports = router;
