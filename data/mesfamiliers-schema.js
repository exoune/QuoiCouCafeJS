const mongoose = require('mongoose'); // Ajoutez cette ligne pour importer mongoose

const { Schema, model, models } = mongoose; // Utilisez mongoose pour définir le Schema, model et models

const mesfamiliersSchema = new Schema({
    _id: { 
        type: String, 
        required: true // Requis
    },

    familiersAttrapes: [{ 
        type: String 
    }], 
});
const name = "mesfamiliers";
module.exports = models[name] || model(name, mesfamiliersSchema);
