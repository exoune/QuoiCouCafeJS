const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const scoreDevinetteSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    nom: {
        type: String,
        required: true,
    },

    points: {
        type: Number,
        required: true
    }
});

// Création du modèle à partir du schéma
const name = "scoreDevinette";
module.exports = models[name] || model(name, scoreDevinetteSchema);