const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const astroSchema = new Schema({

    _id: {
        type: String,
        required: true,
    },

    nom: {
        type: String,
        required: true,
    },

    sign: {
        type: String,
        required: true,
    }
});

// Création du modèle à partir du schéma
const name = "astro";
module.exports = models[name] || model(name, astroSchema);
