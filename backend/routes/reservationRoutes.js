const express = require('express');
const Reservation = require('../models/Reservation');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const reservation = new Reservation({
      accommodation: req.body.accommodation,
      user: req.body.user || 'guest',
      checkIn: new Date(req.body.checkIn),
      checkOut: new Date(req.body.checkOut),
      guests: req.body.guests,
      totalPrice: req.body.totalPrice,
      status: 'confirmed'
    });
    
    await reservation.save();
    await reservation.populate('accommodation');
    
    res.status(201).json({
      message: 'Booking confirmed!',
      reservation: reservation
    });
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

router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('accommodation');
    if (!reservation) return res.status(404).json({ error: 'Booking not found' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;