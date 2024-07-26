const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const puserPokemonSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    nom: {
        type: String,
        required: true,
    },

    nbTotal: { 
        type: Number, 
        required: true, // Requis
    },

    pokemon: {
        type: [String], // Tableau de chaînes de caractères
        required: true,
    },

});

// Création du modèle à partir du schéma
const name = "userPokemon";
module.exports = models[name] || model(name, puserPokemonSchema);


