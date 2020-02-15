const express = require('express');
const router = express.Router();
// Express subpackage that gives capabilities to handle
// different routes reaching different endpoints
const mongoose = require('mongoose');

const Reservation = require('../models/reservation');
const Charger = require('../models/charger');

router.get('/', (req, res, next) => {
  Reservation.find()
  .select('charger date minutes total_price _id')
  .populate('charger') // JOIN TABLES
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        reservations: docs.map(doc => {
          return { 
            _id: doc._id,
            charger: doc.charger,
            date: doc.date,
            minutes: doc.minutes,
            total_price: doc.total_price,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/reservations/' + doc._id
            }
          }
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
    });
  });
});

router.post('/', (req, res, next) => {
  Charger.findById(req.body.chargerId)
  .then(charger => {
    if (!charger) {
      return res.status(404).json({
        message: 'Charger not found'
      })
    }
    const reservation = new Reservation({
      _id: mongoose.Types.ObjectId(),
      date: req.body.date,
      minutes: req.body.minutes,
      total_price: req.body.total_price,
      charger: req.body.chargerId 
    });
    return reservation.save()
  })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: 'Reservation booked',
          createdReservation: {
            _id: result._id,
            date: result.date,
            minutes: result.minutes,
            total_price: result.total_price,
            charger: result.chargerId
          },
          request: {
            type: 'GET',
            url: 'http://localhost:3000/reservations/' + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
      });
    });
  });
  
router.get('/:reservationId', (req, res, next) => {
  Reservation.findById(req.params.reservationId)
    .populate('charger') // JOIN TABLES
    .exec()
    .then(reservation => {
      if (!reservation) {
        return res.status(404).json({
          message: 'Reservation not found'
        });
      }
      res.status(200).json({
        reservation: reservation,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/reservations'
        }
      });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});


  
  router.delete("/:reservationId", (req, res, next) => {
    Reservation.remove({ _id: req.params.reservationId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Reservation deleted",
          request: {
            type: "POST",
            url: "http://localhost:3000/reservations",
            body: { chargerId: "ID", date: "Number", minutes: "Number", total_price: "Number" }
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;