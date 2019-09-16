const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  let isAdmin = false;
  var origin = req.headers.origin;
  console.log(
    "Login request from " + origin + " with username: " + req.body.username
  );
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      if (fetchedUser._id == process.env.ADMIN_ID) {
        isAdmin = true;
        console.log("isAdmin status: " + isAdmin);
      } else {
        console.log(fetchedUser._id);
        console.log(process.env.ADMIN_ID);
        console.log("isAdmin status: " + isAdmin);
      }
      const token = jwt.sign(
        {
          username: fetchedUser.username,
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        isAdmin: isAdmin
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

module.exports = router;
