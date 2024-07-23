const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose;

const statsTarotSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    label: {
        type: String,
        required: true,
    },

    nb_apparition: {
        type: Number,
        required: true
    },

    gwendal:{
        type: Number,
        required: true
    },
    
    ambre:{
        type: Number,
        required: true
    },

    lucas:{
        type: Number,
        required: true
    },

    clemence:{
        type: Number,
        required: true
    },

    fiona:{
        type: Number,
        required: true
    },

    benjamin:{
        type: Number,
        required: true
    }
});

// Création du modèle à partir du schéma
const name = "statsTarot";
module.exports = models[name] || model(name, statsTarotSchema);

