var app = require("express");
var router = app.Router();

const Character = require("../../models/character");
const checkAuth = require("../../middleware/check-auth");

router.get("/", checkAuth, (req, res, next) => {
  var origin = req.headers.origin;
  var currentUser = req.userData.userId;
  console.log("Characters requested by: " + origin);
  Character.find(
    { deleted: false, owner: currentUser },
    (err, allCharacters) => {
      if (allCharacters) {
        console.log("Sending a list of all characters to: " + origin);
        res.status(200).send(allCharacters);
      } else {
        console.log(err);
        console.log("No characters found.");
        res.sendStatus(404);
      }
    }
  );
});

router.post("/", checkAuth, (req, res, next) => {
  var origin = req.headers.origin;
  var currentUser = req.userData.userId;
  var currentUserName = req.userData.username;
  console.log("Character posted by: " + origin);
  if (req.body === {}) {
    res.status(400).send("Error: Emtpy request.");
  } else {
    var newCharacterData = req.body;
    console.log(newCharacterData);
    Character.create(newCharacterData, (err, newCharacter) => {
      if (!err) {
        res.status(200).json({
          message: "Character created."
        });
        console.log(
          "Success: character with id " + newCharacter._id + " created."
        );
        Character.updateOne(
          { _id: newCharacter._id },
          { deleted: false, owner: currentUser, ownerName: currentUserName },
          err => {
            if (!err) {
              console.log("Success.");
            } else {
              console.log("Failure.");
            }
          }
        );
      } else {
        res.status(500).send("Failure.");
        console.log(err);
        console.log("Failure.");
      }
    });
  }
});

router.get("/:id", checkAuth, (req, res, next) => {
  var id = req.params.id;
  var origin = req.headers.origin;
  console.log("Character with id " + id + " requested by " + origin);
  Character.find({ _id: id }, (err, requestedCharacter) => {
    if (requestedCharacter) {
      console.log("Sending response to: " + origin);
      res.status(200).send(requestedCharacter);
    } else {
      console.log(err);
      console.log("No characters found.");
      res.sendStatus(404);
    }
  });
});

router.patch("/:id", checkAuth, (req, res, next) => {
  var id = req.params.id;
  var data = req.body.data;
  var origin = req.headers.origin;
  console.log("Character PATCH with id " + id + " requested by " + origin);
  if (data === {}) {
    res.status(400).send("Error: Emtpy request.");
  } else {
    Character.updateOne({ _id: id }, data, err => {
      if (err) {
        res.status(500).send("Failure.");
        console.log(err);
        console.log("Failure.");
      } else {
        res.status(200).json({
          message: "Character updated."
        });
        console.log("Success.");
        console.log(data);
      }
    });
  }
});

router.delete("/:id", checkAuth, (req, res, next) => {
  var id = req.params.id;
  var origin = req.headers.origin;
  console.log("Character DELETE with id " + id + " requested by " + origin);
  Character.updateOne({ _id: id }, { deleted: true }, err => {
    if (err) {
      res.status(500).send("Failure.");
      console.log(err);
      console.log("Failure.");
    } else {
      res.status(200).json({
        message: "Character deleted."
      });
      console.log("Success: character flagged for delete.");
    }
  });
});

module.exports = router;
