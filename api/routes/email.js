const express = require("express");
const router = express.Router(); // Express subpackage that gives capabilities to handle // different routes reaching different endpoints
const jwt = require("jsonwebtoken"); // JsonWebToken --> (Restful servers cannot return Sessions because are stateless)
const sgMail = require("@sendgrid/mail");

router.post("/", (req, res, next) => {
  emailTo = req.body.emailTo;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: emailTo,
    from: "test@example.com",
    subject: "Sending with Twilio SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>"
  };
  sgMail
    .send(msg)
    .then(result => {
      console.log(result);
      res.status(201).json({ result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;