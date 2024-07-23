const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

// Modèle de données pour les utilisateurs qui ont utilisé la commande
const UserCommandeTirerSchema = new mongoose.Schema({
    userId: String,
    date: Date
});
// Création du modèle à partir du schéma
const name = "userCommandeTirer";
module.exports = models[name] || model(name, UserCommandeTirerSchema);