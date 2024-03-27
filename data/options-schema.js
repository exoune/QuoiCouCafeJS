const { Schema, model, models } = require('mongoose')

const optionsSchema = new Schema({
  _id:{
    type: String,
    required: true
  },
  _name:{
    type: String,
    required: true
  },
  value: {
    type: Boolean,
    required: true
  }
});

const name = "options";
module.exports = models[name] || model(name, optionsSchema);