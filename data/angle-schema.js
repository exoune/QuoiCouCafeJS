const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const angleSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    angle: {
        type: Number,
        required: true,
    }
});

// Création du modèle à partir du schéma
const name = "angle";
module.exports = models[name] || model(name, angleSchema);

