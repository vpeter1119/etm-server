var app = require("express");
var router = app.Router();

const Character = require("../../models/character");
const User = require("../../models/user");
const checkAuth = require("../../middleware/check-auth");

router.get("/status", (req,res,next) => {
	res.status(200).send(true);
})

router.get("/characters", checkAuth, (req, res, next) => {
  var origin = req.headers.origin;
  var currentUser = req.userData.userId;
  console.log("Characters (admin) requested by: " + origin);
  if (currentUser === process.env.ADMIN_ID) {
    Character.find({}, (err, allCharacters) => {
      if (err) {
        console.log(err);
        console.log("Failed to retreive all characters.");
        res
          .status(500)
          .json({ message: "Server failed to retrieve characters." });
      } else {
        if (!allCharacters) {
          console.log("No characters found.");
          res.status(404).json({ message: "No characters found." });
        } else {
          console.log("Success.");
          res.status(200).json(allCharacters);
        }
      }
    });
  } else {
    res.status(401).json({ message: "Insufficicent permissions." });
  }
});

router.get("/users", checkAuth, (req, res, next) => {
  var origin = req.headers.origin;
  var currentUser = req.userData.userId;
  console.log("Users (admin) requested by: " + origin);
  if (currentUser === process.env.ADMIN_ID) {
    User.find({}, (err, allUsers) => {
      if (err) {
        console.log(err);
        console.log("Failed to retreive all users.");
        res
          .status(500)
          .json({ message: "Server failed to retrieve users." });
      } else {
        if (!allUsers) {
          console.log("No characters found.");
          res.status(404).json({ message: "No users found." });
        } else {
          console.log("Success.");
          res.status(200).json(allUsers);
        }
      }
    });
  } else {
    res.status(401).json({ message: "Insufficicent permissions." });
  }
});

module.exports = router;
