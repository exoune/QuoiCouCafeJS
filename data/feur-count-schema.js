const { Schema, model, models } = require('mongoose')

const feurCountSchema = new Schema({
  _id:{
    // Discord user id
    type: String,
    required: true
  },
  feurCount: {
    type: Number,
    required: true
  }
});

const name = "feur-counts";
module.exports = models[name] || model(name, feurCountSchema);