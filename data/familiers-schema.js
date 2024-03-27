const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const familiersSchema = new Schema({
    _nom: {
        type: String,
        unique : true
    },
    rarete: { 
        type: Number, 
        min: 1, 
        max: 5 
    }, // Ajoutez un champ pour la rareté
    question: String,
    reponse: String,
});
const name = "familiers";
module.exports = models[name] || model(name, familiersSchema);
