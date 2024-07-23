const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const dailyLimitsCarteSchema = new Schema({
    _id: { 
        type: String, 
        required: true, // Requis
    },

    nom: {
        type: String,
        required: true,
    },

    nbJour: { 
        type: Number, 
        required: true, // Requis
    },

    nbTotal: { 
        type: Number, 
        required: true, // Requis
    },

    cartes: {
        type: [String], // Tableau de chaînes de caractères
        required: true,
    },
});

// Création du modèle à partir du schéma
const name = "dailyLimits";
module.exports = models[name] || model(name, dailyLimitsCarteSchema);
