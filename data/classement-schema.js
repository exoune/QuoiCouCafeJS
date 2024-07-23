const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const classementSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    nom: {
        type: String,
        required: true,
    },

    points_semaine: {
        type: Number,
        required: true
    },

    victoires: {
        type: Number,
        required: true
    }
});

// Création du modèle à partir du schéma
const name = "classement";
module.exports = models[name] || model(name, classementSchema);

