const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const pokemonSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    nom: {
        type: String,
        required: true,
    },

    extension: {
        type: String,
        required: true,
    },

    imagePokemon: {
        type: String,
        required: true,
    },

    imageCarte: { 
        type: String, 
        required: true, // Requis
    }

});

// Création du modèle à partir du schéma
const name = "pokemon";
module.exports = models[name] || model(name, pokemonSchema);


