const express = require('express');
const Reservation = require('../models/Reservation');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('accommodation');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;