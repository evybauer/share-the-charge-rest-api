// uses express to handle requests easialy

const express = require("express");
const app = express();
const morgan = require("morgan"); //Express funnels all requests to morgan (end-middleware) and morgan handles the next action within the routes
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const chargerRoutes = require("./api/routes/chargers");
const reservationRoutes = require("./api/routes/reservations");
const userRoutes = require("./api/routes/user");
const connectionTypeRoutes = require("./api/routes/connectionType");
const emailRoutes = require("./api/routes/email");
const pictureRoutes = require("./api/routes/picture");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

mongoose.Promise = require("bluebird");
mongoose.connect(
  "mongodb+srv://mongo:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-charger-dg8re.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

//SWAGGER
const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    openapi: "3.0.0",
    info: {
      title: "Share The Charger API",
      version: "1.0.0",
      description: "Share The Charger API written in NodeJS + Express"
    }
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ["api/routes/*.js"]
};

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024
  }
});

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// app.get("/api-docs", swaggerUi.setup(swaggerDocument));

//MIDDLEWARE
app.use(morgan("dev")); //logs the requests in the terminal
app.use("/uploads", express.static("uploads")); // '/uploads' in the beggining of the app.use ignores the /uploads file and embeds the path of the photo only, not the /upload route // static >> Make the upload folder public so we do not need to create a route to lookup photos
app.use(bodyParser.urlencoded({ extended: false })); // Extracts json and makes it easier to read
app.use(bodyParser.json()); // Extracts json and makes it easier to read
app.use(multerMid.single("file"));

//CORS headers -- Provide answer when localhost tries to access Server + Prevent CORS errors + Protect other web pages to access my API
//CORS error message handler, * give access to any client
// What I want to give access to headers
//req.method = http request, Browsers allways send OPTIONS to make sure if they can access
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//ROUTES that handle requests
//app.use = middleware
//an incoming request has to go through app.use
//and to whatever we pass to it (can have different formats)
app.use("/chargers", chargerRoutes);
app.use("/reservations", reservationRoutes);
app.use("/user", userRoutes);
app.use("/connectionType", connectionTypeRoutes);
app.use("/email", emailRoutes);
app.use("/picture", pictureRoutes);

//ERROR HANDLING
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
//handle errors after passing the routes

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
//handle any errors

module.exports = app;

/* AUTHETICATION ON RESTFUL API:
- Client = the frontend
- Client sends auth data to Server
- Server store the data in the DB
- If user logged in the past Server checks Client's data
- Server returns a TOKEN (object that contains signature that we can verify on the server) (Restful servers cannot return Sessions because are stateless)
- The toke ins a Json web Token(JWT): Json Data + Signature (can be verified)
- Token can be stored by the client
- Token is stored on the Client side so every time the Client tries to access the Servaer the servaer can check if the token is valid
Storage <------Store Token------Client---------
                                |    |         |
                        send auth     Token    | 
                                |    *         |
                                |    |         |
                                *    |         |
     (Restful API is stateless) Server---------|
*/