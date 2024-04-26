const mongoose = require('mongoose'); // Importez mongoose
const { Schema, model, models } = mongoose; // Utilisez mongoose pour définir le Schema, model et models

const carteSchema = new Schema({

    _id: { 
        type: String, 
        required: true, // Requis
    },

    label: { 
        type: String,
        required: true
    },

    description: { 
        type: String,
        required: true
    },

    description_endroit: { 
        type: String,
    },

    description_envers: { 
        type: String,
    },

    est_arcane: { 
        type: Number,
    },

    ordre: { 
        type: Number,
    },

    image: String,
});
const name = "carte";
module.exports = models[name] || model(name, carteSchema);
