const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const jourSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    carteMax: {
        type: Number,
        required: true,
    },

    userId: {
        type: String,
        required: true
    },

    user2: {
        type: String,
        required: true
    },
    user3: {
        type: String,
        required: true
    },
    user4: {
        type: String,
        required: true
    }
});

// Création du modèle à partir du schéma
const name = "jour";
module.exports = models[name] || model(name, jourSchema);

