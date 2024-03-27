const { Schema, model, models } = require('mongoose')

const victimeSchema = new Schema({
  _id:{
    // Discord user id
    type: String,
    required: true
  },
  ravage:
  {
    type: String,
    required: true
  },
  victime:
  {
    type: String,
    required: true
  },
  feurCount: {
    type: Number,
    required: true
  }
});

const name = "victime";
module.exports = models[name] || model(name, victimeSchema);