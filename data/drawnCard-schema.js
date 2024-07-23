const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const DrawnCardSchema = new mongoose.Schema({
    card: String,
    date: Date
});

// Création du modèle à partir du schéma
const name = "drawnCard";
module.exports = models[name] || model(name, DrawnCardSchema);