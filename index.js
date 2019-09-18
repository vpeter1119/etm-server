const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();
const port = 8080;

const mongoPW = process.env.MONGODB_PW;
const mongoUser = process.env.MONGODB_USER;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

const pregens = require("./assets/pregens");

mongoose.connect(
  "mongodb+srv://" +
    mongoUser +
    ":" +
    mongoPW +
    "@comchar-vi4nu.mongodb.net/etm",
  { useNewUrlParser: true },
  err => {
    if (!err) {
      console.log("Connected to database.");
    } else {
      console.log(err);
      console.log("Did not connect to database.");
    }
  }
);

var characters = require("./api/routes/characters");
var themebooks = require("./api/routes/themebooks");
var articles = require("./api/routes/articles");
var admin = require("./api/routes/admin");
var users = require("./api/routes/users");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  next();
});

app.get("/", (req, res) => {
  res.send("If you see this, the server is running. Cheers!");
});

app.use("/api/characters", characters);
app.use("/api/themebooks", themebooks);
app.use("/api/articles", articles);
app.use("/api/admin", admin);
app.use("/api/users", users);

//app.listen(port, () => console.log(`Server listening on port ${port}!`));

module.exports = app;
