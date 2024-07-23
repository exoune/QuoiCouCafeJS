const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const tarotDevinSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    maison: {
        type: String,
        required: true,
    },

    label: {
        type: String,
        required: true
    }
});

// Création du modèle à partir du schéma
const name = "tarotDevin";
module.exports = models[name] || model(name, tarotDevinSchema);