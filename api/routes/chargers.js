const express = require("express");
const router = express.Router(); // Express subpackage that gives capabilities to handle // different routes reaching different endpoints
const mongoose = require("mongoose");
const multer = require("multer"); //Package that allows body-parser pass data other than json (ex.: photos)
// const checkAuth = require('../middleware/check-auth'); // If we decied to use, uncomment and add checkAuth before upload.single('chargerPhoto'), except the get route

/*
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
*/

const Charger = require("../models/charger");

/**
 * @swagger
 * /chargers:
 *    get:
 *      tags:
 *        - chargers
 *      summary: Returns a list of all chargers
 *      description: This should return all chargers
 * tags:
 *  - name: chargers
 *    description: Everything about chargers
 */

// ('/') means ('/chargers')
router.get("/", (req, res, next) => {
  Charger.find()
    // .select('title chargerId chargerPhoto numberOfChargers') // To narrow the query
    // .select('-dateCreated') // To narrow the query
    .populate("ownerId") // JOIN TABLES
    .populate("connectionTypeId") // JOIN TABLES
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        chargers: docs.map(doc => {
          return {
            _id: doc._id,
            ownerId: doc.ownerId,

            title: doc.title,
            // chargerPhoto: doc.chargerPhoto,
            costPerKWh: doc.costPerKWh,
            numberOfChargers: doc.numberOfChargers,

            street: doc.street,
            city: doc.city,
            stateOrProvince: doc.stateOrProvince,
            postCode: doc.postCode,
            countryId: doc.countryId,
            latitude: doc.latitude,
            longitude: doc.longitude,

            generalComments: doc.generalComments,
            typeOfCharger: doc.typeOfCharger,
            active: doc.active,
            dateAvailableStart: doc.dateAvailableStart,
            dateAvailableEnd: doc.dateAvailableEnd,
            hourStart: doc.hourStart,
            hourEnd: doc.hourEnd,

            connectionTypeId: doc.connectionTypeId,

            pictureUrl: doc.pictureUrl,

            dateCreated: doc.dateCreated,

            request: {
              type: "GET",
              url: "http://localhost:3000/chargers/" + doc._id
            }
          };
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

/**
 * @swagger
 * /chargers:
 *    post:
 *      tags:
 *        - chargers
 *      summary: Create new charge
 *      description: This should create a new charge
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                onwerId:
 *                  type: string
 *                title:
 *                  type: string
 *                costPerKWh:
 *                  type: number
 *                numberOfChargers:
 *                  type: number
 *                city:
 *                  type: string
 *                stateOrProvince:
 *                  type: string
 *                postCode:
 *                  type: string
 *                countryId:
 *                  type: string
 *                latitude:
 *                  type: number
 *                longitude:
 *                  type: number
 *                generalComments:
 *                  type: string
 *                typeOfCharger:
 *                  type: string
 *                active:
 *                  type: boolean
 *                dateAvailableStart:
 *                  type: string
 *                  format: date
 *                dateAvailableEnd:
 *                  type: string
 *                  format: date
 *                hourStart:
 *                  type: number
 *                hourEnd:
 *                  type: number
 *                connectionTypeId:
 *                  type: number
 *      responses:
 *        '201':
 *          description: Created
 */

//upload.single() is a middleware handling event that accespt one single file.
//Is passed as an argument in the POST route so it uploads the photo accordingly
router.post("/", (req, res, next) => {
  // console.log(req.file); //-- Check info of the file uploaded
  //Store Data with Mongoose
  console.log(req.file);
  console.log(req.body.connectionTypeId);
  const charger = new Charger({
    _id: new mongoose.Types.ObjectId(),
    ownerId: req.body.ownerId,
    title: req.body.title,
    // chargerPhoto: req.file.path, // Photo URL
    costPerKWh: req.body.costPerKWh,
    numberOfChargers: req.body.numberOfChargers,

    street: req.body.street,
    city: req.body.city,
    stateOrProvince: req.body.stateOrProvince,
    postCode: req.body.postCode,
    countryId: req.body.countryId,
    latitude: req.body.latitude,
    longitude: req.body.longitude,

    generalComments: req.body.generalComments,
    typeOfCharger: req.body.typeOfCharger,
    active: req.body.active,
    dateAvailableStart: req.body.dateAvailableStart,
    dateAvailableEnd: req.body.dateAvailableEnd,
    hourStart: req.body.hourStart,
    hourEnd: req.body.hourEnd,

    connectionTypeId: req.body.connectionTypeId,

    dateCreated: req.body.createAt
  });

  //mongoose method to save to the database
  charger
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created charger successfully",
        createdCharger: {
          _id: result._id,
          ownerId: result.ownerId,
          title: result.title,
          // chargerPhoto: result.chargerPhoto,
          costPerKWh: result.costPerKWh,
          numberOfChargers: result.numberOfChargers,

          street: result.street,
          city: result.city,
          stateOrProvince: result.stateOrProvince,
          postCode: result.postCode,
          countryId: result.countryId,
          latitude: result.latitude,
          longitude: result.longitude,

          generalComments: result.generalComments,
          typeOfCharger: result.typeOfCharger,
          active: result.active,
          dateAvailableStart: result.dateAvailableStart,
          dateAvailableEnd: result.dateAvailableEnd,
          hourStart: result.hourStart,
          hourEnd: result.hourEnd,

          connectionTypeId: result.connectionTypeId,

          dateCreated: result.createAt,

          request: {
            type: "GET",
            url: "http://localhost:3000/chargers/" + result._id
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

/**
 * @swagger
 * /chargers/{id}:
 *    get:
 *      tags:
 *        - chargers
 *      summary: Returns specific chargerId Document
 *      description: This should return specific chargerId document
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: integer
 *        maximum: 1
 *      description: The ChargerId
 */

router.get("/:chargerId", (req, res, next) => {
  const id = req.params.chargerId;
  Charger.findById(id)
    .populate("connectionTypeId") // JOIN TABLES
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          charger: doc,
          request: {
            type: "GET",
            description: "Gets all chargers",
            url: "http://localhost:3000/chargers/"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * @swagger
 * /chargers/{id}:
 *    patch:
 *      tags:
 *        - chargers
 *      summary: Patch specific chargerId Document
 *      description: This should patch specific chargerId document
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                    proptitle:
 *                      type: string
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: integer
 *        maximum: 1
 *      description: The ChargerId
 *      responses:
 *        '201':
 *          description: Created
 */

router.patch("/:chargerId", (req, res, next) => {
  console.log(req.body);
  const id = req.params.chargerId;
  const updateOps = {}; //update all Operations(Ops)
  for (const ops of req.body) {
    updateOps[ops.propTitle] = ops.value;
  }
  Charger.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Charger updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/chargers/" + id
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

/**
 * @swagger
 * /chargers/{id}:
 *    delete:
 *      tags:
 *        - chargers
 *      summary: Delete specific chargerId Document
 *      description: This should delete specific chargerId document
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: integer
 *        maximum: 1
 *      description: The ChargerId
 */

router.delete("/:chargerId", (req, res, next) => {
  const id = req.params.chargerId;
  Charger.remove({
    _id: id
  })
    .select("title _id ownerId chargerId") // To narrow the query
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Charger deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/chargers"
          // data: { title: 'String' }
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

// router.patch("/:chargerId", (req, res, next) => {
//   console.log(req.body);
//   const id = req.params.chargerId;
//   const updateOps = {}; //update all Operations(Ops)
//   for (const ops of req.body) {
//     updateOps[ops.propTitle] = ops.value;
//   }
//   Charger.update({ _id: id }, { $set: updateOps })
//     .exec()
//     .then(result => {
//       res.status(200).json({
//         message: "Charger updated",
//         request: {
//           type: "GET",
//           url: "http://localhost:3000/chargers/" + id
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// router.delete("/:chargerId", (req, res, next) => {
//   const id = req.params.chargerId;
//   Charger.remove({
//     _id: id
//   })
//     .select("title _id ownerId chargerId") // To narrow the query
//     .exec()
//     .then(result => {
//       res.status(200).json({
//         message: "Charger deleted",
//         request: {
//           type: "POST",
//           url: "http://localhost:3000/chargers"
//           // data: { title: 'String' }
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

/// CHARGER BY OWNER API BELOW ///

/**
 * @swagger
 * /chargers/byOwner/{id}:
 *    get:
 *      tags:
 *        - chargers
 *      summary: Returns specific chargers document(s) attached to a specific ownerId (user table)
 *      description: This should return specific chargers document(s) that are attached to a specific ownerId (user table)
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: integer
 *        maximum: 1
 *      description: The OwnerId
 */

router.get("/byOwner/:ownerId", (req, res, next) => {
  Charger.find({ ownerId: req.params.ownerId })
    .populate("ownerId") // JOIN TABLES
    .populate("connectionTypeId") // JOIN TABLES
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          count: doc.length,
          charger: doc,
          request: {
            type: "GET",
            description: "Gets all chargers",
            url: "http://localhost:3000/chargers/"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

/// CHARGER BY CONNECTION_TYPE_ID API BELOW ///

/**
 * @swagger
 * /chargers/byConnectionType/{id}:
 *    get:
 *      tags:
 *        - chargers
 *      summary: Returns specific chargers document(s) attached to a connectionTypeId  (connectionType table)
 *      description: This should return specific chargers document(s) that are attached to a specific connectionTypeId  (connectionType table)
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: integer
 *        maximum: 1
 *      description: The connectionTypeId
 */

router.get("/byConnectionType/:connectionTypeId", (req, res, next) => {
  Charger.find({ connectionTypeId: req.params.connectionTypeId })
    .populate("ownerId") // JOIN TABLES
    .populate("connectionTypeId") // JOIN TABLES
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          count: doc.length,
          charger: doc,
          request: {
            type: "GET",
            description: "Gets all chargers",
            url: "http://localhost:3000/chargers/"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

/// CHARGER BY CITY NAME API BELOW ///

/**
 * @swagger
 * /chargers/byCity/{id}:
 *    get:
 *      tags:
 *        - chargers
 *      summary: Returns specific chargers document(s) for a specific City name (string)
 *      description: This should return specific chargers document(s) for a specific City name (string)
 *    parameters:
 *    - in: path
 *      name: cityName
 *      required: true
 *      schema:
 *        type: string
 *        maximum: 1
 *      description: The city name
 */

router.get("/byCity/:cityName", (req, res, next) => {
  Charger.find({ city: req.params.cityName })
    .populate("ownerId") // JOIN TABLES
    .populate("connectionTypeId") // JOIN TABLES
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          count: doc.length,
          charger: doc,
          request: {
            type: "GET",
            description: "Gets all chargers",
            url: "http://localhost:3000/chargers/"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;