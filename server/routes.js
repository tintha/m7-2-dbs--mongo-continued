const router = require("express").Router();
const {
  getSeats,
  bookSeat,
  deleteBooking,
  updateCustomer,
} = require("./handlers");

router.get("/api/seat-availability", getSeats);

router.post("/api/book-seat/", bookSeat);

router.delete("/api/delete-booking/:seatId", deleteBooking);

router.put("/api/update-customer/", updateCustomer);

module.exports = router;
