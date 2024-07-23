const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const troubadourSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    nom: {
        type: String,
        required: true,
    },

    valeur: { 
        type: Number,
        default: 0, 
    },

    image: String,
});

// Création du modèle à partir du schéma
const name = "troubadour";
module.exports = models[name] || model(name, troubadourSchema);