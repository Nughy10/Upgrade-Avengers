//PROYECTO FINAL DE NODE -> Upgrade-Avengers

//--------------------------------------------------------------------------------------------------------------------------
//Primero tenemos que generar el archivo package.json para poder instalar todas las librerias. 
// npm init -y          -> Inicialización y creación del archivo pakage.json.

//Ahora tenemos que instalar librerias mediante la terminal. 
// npm i body-parser    -> Libreria que nos ayuda a tranformar los datos (de front a back).
// npm i cors           -> Libreria para la gestión de proxies (URL permitidas).
// npm i dotenv         -> Libreria que nos permite tener variables de configuación o entorno. 
// npm i express        -> Libreria que nos ayuda a crear una Api Rest (Gestionar metodos propios de la libreria).
// npm i mongoose       -> Libreria que nos permite interactuar y conectarnos a la DB.

//También instalaremos la dependencia de nodemon para mantener el servidor iniciado. 
//npm install --save-dev nodemon        -> Libreria que nos transforma la data (pero como dependencia).

//Para finalizar con la configuración principal tenemos que generar el script "start" y "dev" en el archivo package.json.
// "start": "node index.js",
// "dev": "nodemon index.js"

//Hablando de Bases de Datos, tenemos que crear una DB con Mongo Atlas y definirla en un archivo .env, la siguiente:
// MONGO_DB = mongodb+srv://<username>:<password>@avengersdb.gvno6.mongodb.net/?retryWrites=true&w=majority
//Tenemos que cambiar el <username> y el <password> por los definidos en la base de datos crados en Mongo Atlas. 
//PORT=5000

//Para poder hacer la autentificación necesitamos instalar las siguientes librerias.
//npm i passport        -> Libreria middleware que se encargará de gestionar los procesos de autenticación.
//npm i passport-local  -> Libreria de estrategia de autenticación con passport por medio de email y contraseña.
//npm i express-session -> Libreria que gestionará las sesiones de nuestros usuarios usando cookies. 
//npm i connect-mongo   -> Libreria que se encargará de guardar las sesiones en nuestra base de datos y actualizarlas.
//npm i bcrypt          -> Libreria necesaria para poder hacer un hash de nuestro password antes de guardarlo en la DB.
//--------------------------------------------------------------------------------------------------------------------------

//INICIALIZACIÓN DEL SERVIDOR!

//Definimos una variable que requiera la libreria "express", "cors" y "body-parser".
//(libreria que nos ayuda a crear una Api Rest (Gestionar metodos propios de la libreria)).
//(libreria para la gestión de proxies (URL permitidas)).
//(libreria que nos ayuda a tranformar los datos (de front a back)).
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//Definimos una variable que requiera la libreria "passport", "express-sesion" y "connect-mongo".
//(libreria middleware que se encargará de gestionar los procesos de autenticación).
//(libreria que gestionará las sesiones de nuestros usuarios usando cookies).
//(libreria que se encargará de guardar las sesiones en nuestra base de datos y actualizarlas).
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

//Definimos una variable que requiera la configuración de las distintas rutas para usuarios. 
//Inicializamos el archivo que requiera la configuración de la autenticación de usuarios. 
const userRouter = require('./src/api/routes/users.routes');
require('./src/utils/auth/passport')

//Definimos una variable que requiera la función de inicialización de la conexión con la DB.
//Definimos una variable que requiera la configuración de las distintas rutas para peliculas. 
const { connect } = require("./src/utils/database/db");
const movies = require('./src/api/routes/movies.routes');

//Inicializamos la función de la conexión con la base de datos.
connect();

//Definimos una variable donde se guarda la inicialización de express. 
const app = express();

//Configuración de la variable anterior para poder hacer la lectura en json.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//Inicialización de la libreria para la gestión de proxies (URL permitidas).
app.use(cors());

//Definición de la Api como pública (sin restricciones de urls).
app.use('/public', express.static('public'));

//Definición de la inicialización de sesión de usuario (login) con su configuración. 
app.use(
    session({
        //Este secreto lo tendremos que cambiar cuando terminemos el proyecto. 
        secret: 'upgradehub_node', 
        //Solo guardará la sesión si hay cambios durante la sesión esté iniciada. 
        resave: false, 
        //Siempre a false ya que gestionamos nuestra sesión con passport. 
        saveUninitialized: false, 
        //Creación de una cookie (1hora) qua aparecerá cuando te autentificas como usuario (login).
        cookie: {
        maxAge: 3600000, 
        },
        //Guardamos los datos autenticación de usuario en la base de datos de Mongo Atlas. 
        store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB,
      })
    })
  );
//Inicializamos la libreria passport que se encargará de gestionar los procesos de autenticación.
//Inicializamos el middlware que se encargará de añadir sesiones a nuestros usuarios. 
app.use(passport.initialize());
app.use(passport.session()); 

//Definición del servidor local para poder encontrar las diferentes rutas. 
//Definición del servidor local para poder realizar las diferentes autenticaciones. 
app.use('/', movies);
app.use('/users', userRouter);

//Definición de una variable para el requeremiso del puerto.
const port = process.env.PORT || 8000;

//Definición de una función para inicializar el servidor.
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
});

//Definimos una función para la deteción de errores con los atributos Request, Response y Next. 
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

//Definimos una función para manjear los errores, si hay un error nos lo devolverá. 
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
