//CONEXIÓN CON LA BASE DE DATOS (./utils/auth/passport.js)

//Definimos una variable que requiera la libreria "passport", "passport-local" y "bcrypt".
//(libreria middleware que se encargará de gestionar los procesos de autenticación).
//(libreria de estrategia de autenticación con passport por medio de email y contraseña).
//(libreria necesaria para poder hacer un hash de nuestro password antes de guardarlo en la DB).
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

//Definimos una variable que requiera la configuración de los distintos modelos para usuarios.
const User = require('../../api/models/users.model');
//Definimos una variable que encripta la contraseña un número de veces determinado (10).
const saltRounds = 10;

//Definición de la estrategia de registro del usuario y sus atributos. 
passport.use('register', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    //Definimos una función asíncrona con los atributos request, email, password y error. 
    //Mediante el try definiremos lo que queremos que realize la función. 
    //Mediante el catch manejaremos los posibles errores de conexión con la db. 
    async (req, email, password, done) => {
      try {
        //Definimos una variable de espera que comprueva si el usuario existe en nuestra db. 
        const previousUser = await User.findOne({ email: email });

        //Bucle condicional por si el usuario ya existe en nuestra base de datos.
        //Definimos una variable y le retornamos el error en caso de error.  
        if (previousUser) {
          const error = new Error('The user is already registered!');
          return done(error);
        }

        //Definimos una variable de espera que encripte la contrasenya antes de registrarla.
        const pwdHash = await bcrypt.hash(password, saltRounds);

        //Definomos una variable donde guardaremos la información que pasamos a la db. 
        const newUser = new User({
          email: email,
          password: pwdHash,
        });

        //Definimos una variable de espera que nos guardará la información a la db. 
        const savedUser = await newUser.save();
        
        //Invocamos el callback con el null (donde iria el error) y el usuario creado. 
        done(null, savedUser);
      } catch (error) {
            return done(error);
      }
    }
  )
);

//Definición de la estrategia de login de usuario y sus atributos. 
passport.use('login', new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      //Definimos una función asíncrona con los atributos request, email, password y error. 
      //Mediante el try definiremos lo que queremos que realize la función. 
      //Mediante el catch manejaremos los posibles errores de conexión con la db. 
      async (req, email, password, done) => {
        try {
          //Definimos una variable de espera que comprueva si el usuario existe en nuestra db.
          const currentUser = await User.findOne({ email: email });
  
          //Bucle condicional por si el usuario NO existe en nuestra base de datos.
          //Definimos una variable y le retornamos el error en caso de error.
          if (!currentUser) {
            const error = new Error('The user does not exist!');
            return done(error);
          }
  
          //Definimos una variable de espera que encripte la contrasenya antes de registrarla.
          const isValidPassword = await bcrypt.compare(
            password,
            currentUser.password
          );
  
          //Bucle condicional por si la contraseña no tiene un formato válido.  
          //Definimos una variable y le retornamos el error en caso de error.
          if (!isValidPassword) {
            const error = new Error(
              'The email & password combination is incorrect!'
            );
            return done(error);
          }
          
          //Invocamos el callback con el null (donde iria el error) y el usuario creado. 
          //Si todo se valida correctamente, eliminamos la contraseña de la base de datos. 
          currentUser.password = null;
            return done(null, currentUser);
        } catch (error) {
            return done(error);
        }
      }
    )
  );

//Definimos una función para serializar el usuario y registrar su id. 
passport.serializeUser((user, done) => {
    return done(null, user._id);
});
  
//Definimos una función asíncrona para desserializar el usuario por su id.
//Mediante el try definiremos lo que queremos que realize la función.
//Mediante el catch manejaremos los posibles errores de conexión con la db. 
passport.deserializeUser(async (userId, done) => {
    try {
      //Definimos una variable de espera que buscará el usuario por su id. 
      const existingUser = await User.findById(userId);
        return done(null, existingUser);
    } catch (err) {
        return done(err);
    }
});