//CREACIÓN DE MODELOS PARA LA DB (./api/models/users.model.js)

//Definimos una variable que requiera la libreria "mongoose".
//(libreria que nos permite interactuar y conectarnos a la DB).
const mongoose = require('mongoose');

//Definimos una variable esquema que contendrá el modelo.
const Schema = mongoose.Schema;

//Definimos una variable objeto con los atributos de este modelo. 
const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    //Sirve para guardar la hora y la fecha en cada actualización
    timestamps: true,
  }
);

//Definimos una variable para exportar y le guardamos modelo para poder llamarlo desde el index.js.
const User = mongoose.model('User', userSchema);
module.exports = User;