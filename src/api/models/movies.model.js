//CREACIÓN DE MODELOS PARA LA DB (./api/models/movies.model.js)

//Definimos una variable que requiera la libreria "mongoose".
//(libreria que nos permite interactuar y conectarnos a la DB).
const mongoose = require('mongoose');

//Definimos una variable esquema que contendrá el modelo. 
const Schema = mongoose.Schema;

//Definimos una variable objeto con los atributos de este modelo. 
let moviesSchema = new Schema({
    name: {
        type: 'string',
    },
    description: {
        type: 'string'
    },
    duration: {
        type: 'number'
    },
    date: {
        type: 'string'
    }
}, {
    //Sirve para guardar la hora y la fecha en cada actualización.
    timestamps:true
});

//Exportamos el modelo para poder llamarlo desde el index.js.
module.exports = mongoose.model('Movie', moviesSchema);