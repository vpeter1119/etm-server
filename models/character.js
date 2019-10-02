const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
  deleted: Boolean,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    //required: true
  },
  ownerName: String,
  name: String,
  mythos: String,
  logos: String,
  cards: [
    {
      cardtype: String,
      theme: String,
      title: String,
      qors: String,
      ptags: [
        {
          letter: String,
          tag: String
        }
      ],
      wtags: [
        {
          letter: String,
          tag: String
        }
      ]
    }
  ]
}, { timestamps: true });

const Character = mongoose.model("Character", characterSchema);

module.exports = Character;
