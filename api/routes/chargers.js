const express = require('express');
const router = express.Router(); // Express subpackage that gives capabilities to handle // different routes reaching different endpoints
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

//PHOTO FILTER -- Check if file type is accepted by the DB
const fileFilter = ( req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
     //accept a file
    cb(null, true);
  } else {
    //reject a file
    cb(null, false);
  }
};

//PHOTO FILTER -- Check if file size is accepted by the DB
const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}); // dest: 'uploads/' -- initialize multer and store all the photos into a destination: uploads folder

const Charger = require('../models/charger');

// ('/') means ('/chargers')
router.get('/', (req, res, next) => {
  Charger.find()
    // .select('title cost_per_charge _id chargerPhoto numberOfChargers') // To narrow the query
    // .select('-dateCreated') // To narrow the query
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        chargers: docs.map(doc => {
          return {

            _id: doc._id,
            ownerId: doc.ownerId,

            title: doc.title,
            chargerPhoto: doc.chargerPhoto,
            costPerMinute: doc.costPerMinute,
            numberOfChargers: doc.numberOfChargers,

            street: doc.street,
            city: doc.city,
            stateOrProvince: doc.stateOrProvince,
            postCode: doc.postCode,
            countryId: doc.countryId,
            latitude: doc.latitude,
            longitude: doc.longitude,

            generalComments: doc.generalComments,
            usageRestriction: doc.usageRestriction, 
            typeOfPlug: doc.typeOfPlug  , 
            typeOfCharger: doc.typeOfCharger , 
            active: doc.active , 
            dateAvailableStart: doc.dateAvailableStart ,
            dateAvailableEnd: doc.dateAvailableEnd ,
            hourStart: doc.hourStart ,
            hourEnd: doc.hourEnd,

            // connectionId: doc.connectionId,

            dateCreated: doc.dateCreated,  

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
}); 

//upload.single() is a middleware handling event that accespt one single file. 
//Is passed as an argument in the POST route so it uploads the photo accordingly
router.post('/', upload.single('chargerPhoto'),(req, res, next) => {
  // console.log(req.file); //-- Check info of the file uploaded
  //Store Data with Mongoose
  console.log(req.file);
  const charger = new Charger({     
    _id: new mongoose.Types.ObjectId(),
    ownerId: req.body.ownerId,
    title: req.body.title,
    chargerPhoto: req.file.path, // Photo URL
    costPerMinute: req.body.costPerMinute,
    numberOfChargers: req.body.numberOfChargers,

    street: req.body.street,
    city: req.body.city,
    stateOrProvince: req.body.stateOrProvince,
    postCode: req.body.postCode,
    countryId: req.body.countryId,
    latitude: req.body.latitude,
    longitude: req.body.longitude,

    generalComments: req.body.generalComments,
    usageRestriction: req.body.usageRestriction,  
    typeOfPlug: req.body.typeOfPlug  , 
    typeOfCharger: req.body.typeOfCharger , 
    active: req.body.active , 
    dateAvailableStart: req.body.dateAvailableStart ,
    dateAvailableEnd: req.body.dateAvailableEnd ,
    hourStart: req.body.hourStart ,
    hourEnd: req.body.hourEnd,

    // connectionId: req.body.connectionId,

    dateCreated: req.body.createAt,  
  });

  //mongoose method to save to the database
  charger
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created charger successfully',
        createdCharger: {

          _id: result._id,
          ownerId: result.ownerId,
          title: result.title,
          chargerPhoto: result.chargerPhoto,
          costPerMinute: result.costPerMinute,
          numberOfChargers: result.numberOfChargers,

          street: result.street,
          city: result.city,
          stateOrProvince: result.stateOrProvince,
          postCode: result.postCode,
          countryId: result.countryId,
          latitude: result.latitude,
          longitude: result.longitude,

          generalComments: result.generalComments , 
          usageRestriction: result.usageRestriction, 
          typeOfPlug: result.typeOfPlug  , 
          typeOfCharger: result.typeOfCharger , 
          active: result.active , 
          dateAvailableStart: result.dateAvailableStart ,
          dateAvailableEnd: result.dateAvailableEnd ,
          hourStart: result.hourStart ,
          hourEnd: result.hourEnd,

          // connectionId: result.connectionId,

          dateCreated: result.createAt, 

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
  console.log(req.body)
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
        data: { title: 'String' }
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