const express = require('express');
const router = express.Router(); // Express subpackage that gives capabilities to handle // different routes reaching different endpoints
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // JsonWebToken --> (Restful servers cannot return Sessions because are stateless)

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email})
  .exec()
  .then(user => {
    console.log(user)
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
          password: hash,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dateOfBirth: req.body.dateOfBirth,
          phoneNumber: req.body.phoneNumber,
          creditCardNumber: req.body.creditCardNumber,
          creditCardExpirationDate: req.body.creditCardExpirationDate,
          creditCardCvv: req.body.creditCardCvv
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

// ALL USERS
router.get('/', (req, res, next) => {
  User.find()
    // .select('email password') // To narrow the query
    // .select('-creditCardNumber') // To narrow the query
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            _id: doc._id,
            email: doc.email,
            password: doc.hash,
            firstName: doc.firstName,
            lastName: doc.lastName,
            dateOfBirth: doc.dateOfBirth,
            phoneNumber: doc.phoneNumber,
            creditCardNumber: doc.creditCardNumber,
            creditCardExpirationDate: doc.creditCardExpirationDate,
            creditCardCvv: doc.creditCardCvv,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/users/' + doc._id
            }
          }
        })
      };      
      // if (docs.lenght >= 0) {    -- Can se to check that the information of the array is not null -- OPTIONAL: comment out just in case
        res.status(200).json(response);
      // } else {
      //   res.status(404).json({
      //     message: 'No entries found'
      //   });
      // }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}); 

router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
  // .select('')
  .exec()
  .then(doc => {
    console.log('From database', doc);
    if (doc) {
      res.status(200).json({
        charger: doc,
        request: {
          type: 'GET',
          description: 'Gets all users',
          url: 'http://localhost:3000/users/'
        }
        }); 
    } else {
      res.status(404).json({message: 'No valid entry found for provided ID'});
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err})
  });
});

router.patch('/:userId', (req, res, next) => {
  console.log(req.body)
  const id = req.params.userId;
  const updateOps = {};  //update all Operations(Ops)
  for (const ops of req.body) {
    updateOps[ops.propTitle] = ops.value;
  }
  User.update({_id : id},{$set: updateOps})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/user/' + id
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


  router.post('/login', (req, res, next) =>{
    User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length < 1) {
        // return res.status(404).json({
        //   message: 'Email not found, user doesn\'t exist' -- Not a good pattern
          return res.status(401).json({
          message: 'Authentication failed'

        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
        if (err) {
          return res.status(401).json({
            message: 'Authentication failed'
          });
        }
        if (result) {
          const token = jwt.sign({  // Generates the token
            email: user[0].email,
            userId: user[0]._id
          }, 
          process.env.JWT_KEY,
          {
            expiresIn: "1h", //Expiration time of the token
          }
        );
          return res.status(200).json({
            message: 'Authentication successful',
            token: token
          });
        }
        res.status(401).json({
          message: 'Authentication failed' // We get two auth failed so there's no way to know if the password failed because of the password or the email
        })
      })
    }) 
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
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