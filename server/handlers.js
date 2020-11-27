"use strict";
const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

const getSeats = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db("ticket_booking");
    const seats = await db.collection("seats").find().toArray();
    if (seats.length === 0) {
      res.status(404).json({
        status: 404,
        message: "No seat found",
      });
    } else {
      const newSeats = seats.reduce((acc, cur) => {
        acc[cur._id] = cur;
        return acc;
      }, {});

      res.status(200).json({
        status: 200,
        seats: newSeats,
        numOfRows: 8,
        seatsPerRow: 12,
      });
    }
    client.close();
  } catch (e) {
    console.log(e);
  }
};

const bookSeat = async (req, res) => {
  const { seatId, creditCard, expiration, fullName, email } = req.body;
  const _id = seatId;
  const query = { _id };
  const newValue = {
    $set: { isBooked: true, fullName: fullName, email: email },
  };

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("ticket_booking");
    if (!creditCard || !expiration || !fullName || !email) {
      return res.status(400).json({
        status: 400,
        message: "Please provide all required fields!",
      });
    } else {
      const result = await db.collection("seats").updateOne(query, newValue);
      assert.strictEqual(1, result.matchedCount);
      assert.strictEqual(1, result.modifiedCount);
      res.status(200).json({ status: 200, success: true });
    }

    client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      data: req.body,
      message: "An unknown error has occurred. Please try your request again.",
    });
  }
};

const deleteBooking = async (req, res) => {
  const _id = req.params.seatId;
  const query = { _id };
  console.log(query);
  const newValue = {
    $set: { isBooked: false, fullName: null, email: null },
  };

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("ticket_booking");
    const result = await db.collection("seats").updateOne(query, newValue);
    assert.strictEqual(1, result.matchedCount);
    assert.strictEqual(1, result.modifiedCount);
    res.status(202).json({ status: 202, success: true });
    client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      data: req.body,
      message: "An unknown error has occurred. Please try your request again.",
    });
  }
};

const updateCustomer = async (req, res) => {
  const { seatId, fullName, email } = req.body;
  const _id = seatId;
  const query = { _id };
  const newValue = {
    $set: { fullName: fullName, email: email },
  };

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("ticket_booking");
    const result = await db.collection("seats").updateOne(query, newValue);
    assert.strictEqual(1, result.matchedCount);
    assert.strictEqual(1, result.modifiedCount);
    res.status(202).json({ status: 202, success: true });
    client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      data: req.body,
      message: "An unknown error has occurred. Please try your request again.",
    });
  }
};

module.exports = { getSeats, bookSeat, deleteBooking, updateCustomer };
