const express = require('express');
const router = express.Router();
// Express subpackage that gives capabilities to handle
// different routes reaching different endpoints
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email})
  .exec()
  .then(user => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: 'Email exists'
      });
    } else {
      bcrypt.hash(req.body.password, 10, ( err, hash) => {      //Hashed password due to bcrypt // Password is "salted" to avoid hacking
    if (err) {
        return res.status(500).json({
          error: err
        });      
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash
      });
      user
      .save()
      .then(result => {
        console.log(result)
        res.status(201).json({
          message: 'User created'
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    }   
  });
    }
  });
});


router.delete('/:userId', (req, res, next) => {
  User.remove({_id: req.params.userId})
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json({
      message: 'User deleted'
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router; 