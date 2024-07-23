const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const cardSchema = new Schema({

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
        required: true, // Requis
    },

    image: String,
});

// Création du modèle à partir du schéma
const name = "card";
module.exports = models[name] || model(name, cardSchema);

