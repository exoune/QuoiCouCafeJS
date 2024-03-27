const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const coinFoodSchema = new mongoose.Schema({
    _id: {
        type: String, // L'ID de l'utilisateur
        required: true,
        unique: true
    },
    coins: {
        type: Number, // La quantité d'argent de l'utilisateur
        default: 0 // Valeur par défaut : 0
    },
    food: {
        type: Number, // La quantité de nourriture de l'utilisateur
        default: 0 // Valeur par défaut : 0
    },
    vieF: {
        type: Number, // La quantité de nourriture de l'utilisateur
        default: 100 // Valeur par défaut : 0
    },
    nivF: {
        type: Number, // La quantité de nourriture de l'utilisateur
        default: 0 // Valeur par défaut : 0
    },
    lastReward: {
        type: Date,
    },
    lastMeal: {
        type: Date,
    },
});

// Création du modèle à partir du schéma
const name = "coinFood";
module.exports = models[name] || model(name, coinFoodSchema);