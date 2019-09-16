const mongoose = require("mongoose");

const tbSchema = new mongoose.Schema({
  tbtype: String,
  name: String,
  description: String,
  ptagq: {
    A: String,
    aXmp: String,
    B: String,
    bXmp: String,
    C: String,
    cXmp: String,
    D: String,
    dXmp: String,
    E: String,
    eXmp: String,
    F: String,
    fXmp: String,
    G: String,
    gXmp: String,
    H: String,
    hXmp: String,
    I: String,
    iXmp: String,
    J: String,
    jXmp: String
  },
  wtagq: {
    A: String,
    aXmp: String,
    B: String,
    bXmp: String,
    C: String,
    cXmp: String,
    D: String,
    dXmp: String
  },
  improvements: [
    {
      name: String,
      description: String
    }
  ]
});

const Themebook = mongoose.model("Themebook", tbSchema);

module.exports = Themebook;
