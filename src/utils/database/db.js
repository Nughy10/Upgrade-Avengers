//CONEXIÓN CON LA BASE DE DATOS (./utils/database/db.js)

//Definimos una variable que requeiera la libreria "dotenv" y lo inicializamos. 
//(libreria que nos permite tener variables de configuación o entorno). 
const dotenv = require('dotenv');
dotenv.config();

//Definimos una variable que requiera la libreria "mongoose".
//(libreria que nos permite interactuar y conectarnos a la DB).
const mongoose = require('mongoose');

//Definimos una variable con la url de conexión a la base de datos (archivo .env).
const mongoDb = process.env.MONGO_DB;

//Definimos una función asíncrona que cuando sea llamada se conectará a la base de datos. 
//Mediante el try definiremos lo que queremos que realize la función. 
//Mediante el catch manejaremos los posibles errores de conexión con la db. 
const connect = async () => {
    try {
        //Definimos una variable de espera que conectará con la base de datos de MongoDB con los parametros requeridos.
        //Definimos un objeto que recojerá dos atributos de la base de datos y los imprime por consola. 
        const db = await mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });
        const { name, host } = db.connection;
        console.log(`Conectado a la Db: ${name} en el host: ${host}`);

    } catch (error) {
        //Imprimimos por consola si ha habido un error de conexión con la db. 
        console.log(`No se ha podido conectar a la DB`, error)
    }
}
//Exportamos la función que hemos creado para poder llamarla desde el index.js.
module.exports = { connect };