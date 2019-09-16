var app = require("express");
var router = app.Router();

const Themebook = require("../../models/themebook");
const checkAuth = require("../../middleware/check-auth");

router.get("/", checkAuth, (req, res, next) => {
  var mTbList = {};
  var lTbList = {};
  var origin = req.headers.origin;
  console.log("Themebooks GET request by: " + origin);
  const mTbPromise = new Promise((resolve, reject) => {
    Themebook.find({ tbtype: "mythos" }, (err, mythosThemeBooks) => {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      } else {
        resolve(mythosThemeBooks);
      }
    });
  });
  const lTbPromise = new Promise((resolve, reject) => {
    Themebook.find({ tbtype: "logos" }, (err, logosThemeBooks) => {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      } else {
        resolve(logosThemeBooks);
      }
    });
  });
  Promise.all([mTbPromise, lTbPromise]).then(values => {
    var data = {
      mythosTbs: values[0],
      logosTbs: values[1]
    };
    res.status(200).send(data);
  });
});

router.post("/", checkAuth, (req, res, next) => {
  var origin = req.headers.origin;
  console.log("Themebooks POST request by: " + origin);
  if (req.body === {}) {
    res.status(400).send("Error: Emtpy request.");
  } else {
    var newThemeBookData = req.body;
    console.log(newThemeBookData);
    Themebook.create(newThemeBookData, err => {
      if (!err) {
        res.status(200).send("Success.");
        console.log("Success.");
      } else {
        res.status(500).send("Failure.");
        console.log(err);
        console.log("Failure.");
      }
    });
  }
});

router.put("/", checkAuth, (req, res, next) => {
  var origin = req.headers.origin;
  console.log("Themebooks PUT request by: " + origin);
  var data = req.body;
  Themebook.replaceOne({ name: data.name }, data, err => {
    if (err) {
      console.log(err);
      console.log("Failure.");
      res.status(500).json({ message: "Failed to update themebook." });
    } else {
      console.log("Success.");
      res.status(200).json({ message: "Updated themebook." });
    }
  });
});

module.exports = router;
