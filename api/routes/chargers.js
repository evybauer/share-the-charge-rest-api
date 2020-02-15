const express = require('express');
const router = express.Router();
// Express subpackage that gives capabilities to handle
// different routes reaching different endpoints
const mongoose = require('mongoose')
const multer = require('multer') //Package that allows body-parser pass data other than json (ex.: photos)

//PHOTOS STORAGE
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = ( req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
     //accept a file
    cb(null, true);
  } else {
    //reject a file
    cb(null, false);
  }
};

const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}); // dest: 'uploads/' -- initialize multer and store all the photos into a destination: uploads folder

const Charger = require('../models/charger');

router.get('/', (req, res, next) => {
  Charger.find()
    .select('title cost_per_charge _id chargerPhoto')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        chargers: docs.map(doc => {
          return {
            title: doc.title,
            cost_per_charge: doc.cost_per_charge,
            chargerPhoto: doc.chargerPhoto,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/chargers/' + doc._id
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
}); // ('/') means ('/chargers')
//Handles get requests

//upload.single() is a middleware handling event that accespt one single file. 
//Is passed as an argument in the POST route so it uploads the photo accordingly
router.post('/', upload.single('chargerPhoto'),(req, res, next) => {
  // console.log(req.file); //-- Check info of the file uploaded
  //Store Data with Mongoose
  const charger = new Charger({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    cost_per_charge: req.body.cost_per_charge,
    chargerPhoto: req.file.path // Photo URL
  });
  //mongoose method to save to the database
  charger
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created charger successfully',
        createdCharger: {
          title: result.title,
          cost_per_charge: result.cost_per_charge,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/chargers/' + result._id
          }
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

router.get('/:chargerId', (req, res, next) => {
  const id = req.params.chargerId;
  Charger.findById(id)
  .select('title cost_per_charge _id chargerPhoto')
  .exec()
  .then(doc => {
    console.log('From database', doc);
    if (doc) {
      res.status(200).json({
        charger: doc,
        request: {
          type: 'GET',
          description: 'Gets all chargers',
          url: 'http://localhost:3000/chargers/'
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

router.patch('/:chargerId', (req, res, next) => {
  const id = req.params.chargerId;
  const updateOps = {};  //update all Operations(Ops)
  for (const ops of req.body) {
    updateOps[ops.propTitle] = ops.value;
  }
  Charger.update({_id : id},{$set: updateOps})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Charger updated',
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


router.delete('/:chargerId', (req, res, next) => {
  const id = req.params.chargerId;
  Charger.remove({
    _id: id
  })
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Charger deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/chargers',
        data: { title: 'String', cost_per_charge: 'Number' }
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

module.exports = router;