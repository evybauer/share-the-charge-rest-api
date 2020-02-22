const express = require("express");
const router = express.Router(); // Express subpackage that gives capabilities to handle // different routes reaching different endpoints
const mongoose = require("mongoose");
const multer = require("multer");
const uploadImage = require("../middleware/uploadImage");
const Charger = require("../models/charger");
const User = require("../models/user");

// const multerMid = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     // no larger than 5mb.
//     fileSize: 5 * 1024 * 1024
//   }
// });

router.post("/charger", async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    const id = req.body.chargerId;
    console.log(req.body.chargerId);

    const myFile = req.file;
    const imageUrl = await uploadImage(myFile);

    // Saving URL to the Database
    Charger.update({ _id: id }, { pictureUrl: imageUrl })
      .exec()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });

    res.status(200).json({
      message: "Upload was successful",
      data: imageUrl
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: err
    });
    next(error);
  }
});

router.post("/user", async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    const id = req.body.userId;
    console.log(req.body.userId);

    const myFile = req.file;
    const imageUrl = await uploadImage(myFile);
    console.log(imageUrl);

    // Saving URL to the Database
    User.update({ _id: id }, { pictureUrl: imageUrl })
      .exec()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });

    res.status(200).json({
      message: "Upload was successful",
      data: imageUrl
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: err
    });
    next(error);
  }
});

module.exports = router;