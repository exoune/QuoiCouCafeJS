const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const citationSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    quote: {
        type: String,
        required: true,
    },

    author: {
        type: String,
        required: true
    },

    use: {
        type: Boolean,
        required: true
    }
});

// Création du modèle à partir du schéma
const name = "citation";
module.exports = models[name] || model(name, citationSchema);