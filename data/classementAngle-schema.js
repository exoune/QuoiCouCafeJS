const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const classementAngleSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    nom: {
        type: String,
        required: true,
    },

    nombre_essai: {
        type: Number,
        required: true
    },

    trouver: {
        type: Boolean,
        required: true
    },

    position: {
        type: Number,
        required: true
    }
});

// Création du modèle à partir du schéma
const name = "classementAngle";
module.exports = models[name] || model(name, classementAngleSchema);

