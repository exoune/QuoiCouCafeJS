const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const collectionCarteSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    famille: {
        type: String,
        required: true,
    },

    nom: {
        type: String,
        required: true,
    },

    rarete: {
        type: String,
        required: true,
    },

    quantite: { 
        type: Number, 
        required: true, // Requis
    },

    image: String,

});

// Création du modèle à partir du schéma
const name = "collectionCarte";
module.exports = models[name] || model(name, collectionCarteSchema);

