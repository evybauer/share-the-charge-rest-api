const express = require('express');
const router = express.Router(); // Express subpackage that gives capabilities to handle  // different routes reaching different endpoints
const mongoose = require('mongoose');

const Reservation = require('../models/reservation');
const Charger = require('../models/charger');

router.get('/', (req, res, next) => {
  Reservation.find()
  .select('chargerId guestId date minutes total_price _id')
  .populate('chargerId')
  .populate('guestId') // JOIN TABLES
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        reservations: docs.map(doc => {
          return { 
            _id: doc._id,
            chargerId: doc.chargerId,
            guestId: doc.guestId,
            date: doc.date,
            minutes: doc.minutes,
            totalPrice: doc.totalPrice,
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
      chargerId: req.body.chargerId,
      guestId: req.body.guestId,
      date: req.body.date,
      minutes: req.body.minutes,
      totalPrice: req.body.totalPrice,
    });
    return reservation.save()
  })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: 'Reservation booked',
          createdReservation: {
            _id: result._id,
            chargerId: result.chargerId,
            guestId: result.guestId,
            date: result.date,
            minutes: result.minutes,
            totalPrice: result.totalPrice,
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

router.patch('/:reservationId', (req, res, next) => {
  console.log(req.body)
  const id = req.params.reservationId;
  const updateOps = {};  //update all Operations(Ops)
  for (const ops of req.body) {
    updateOps[ops.propTitle] = ops.value;
  }
  Reservation.update({_id : id},{$set: updateOps})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Reservation updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/chargers/' + id
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