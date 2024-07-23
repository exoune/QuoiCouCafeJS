const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const userPSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    nom: {
        type: String,
        required: true,
    },

    useP: {
        type: Boolean,
        required: true
    },

    useT: {
        type: Boolean,
        required: true
    }
});

// Création du modèle à partir du schéma
const name = "userP";
module.exports = models[name] || model(name, userPSchema);

