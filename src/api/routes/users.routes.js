//CREACIÓN DE LAS RUTAS PARA HACER UNA AUTENTICACIÓN (./api/routes/users.routes.js)

//Definimos una variable que requiera la libreria "express" y "passport".
//(libreria que nos ayuda a crear una Api Rest (Gestionar metodos propios de la libreria)).
//(libreria middleware que se encargará de gestionar los procesos de autenticación).
const express = require('express');
const passport = require('passport');

//Definimos una variable para poder crear distintas rutas.
const router = express.Router();

//Definimos una función que crea una ruta POST (CREATE) con los parámetros de Request, Response y Next.
router.post('/register', (req, res, next) => {
    //Definimos una función de autenticación con un registro y un error.
    passport.authenticate('register', (error, user) => {
        //Bucle condicional por si hay un error durante el registro. 
        if (error) {
            return next(error);
        }
        //Definimos una función de registro con el login de usuario y un error. 
        req.logIn(user, (error) => {
            //Bucle condicional por si hay un error durante el login. 
            if (error) {
                return next(error);
            }
            //La función retorna al usuario logeado mediante autenticación. 
            return res.status(200).json(user)
        });
    //Inicializamos la "request" para que nos devuelva la información de registro. 
    })(req);
});

//Definimos una función que crea una ruta POST (CREATE) con los parámetros de Request, Response y Next.
router.post('/login', (req, res, next) => {
    //Definimos una función de autenticación con un login y un error.
    passport.authenticate('login', (error, user) => {
        //Bucle condicional por si hay un error durante el registro. 
        if (error) return next(error)
        //Definimos una función de registro con el login de usuario y un error.
        req.logIn(user, (error) => {
            //Bucle condicional por si hay un error durante el login.
            if (error) {
                return next(error);
            }
            //La función retorna al usuario logeado mediante autenticación. 
            return res.status(200).json(user)
        });
    //Inicializamos la "request" para que nos devuelva la información de registro.
    })(req);
});

//Definimos una función que crea una ruta POST (CREATE) con los parámetros de Request, Response y Next.
router.post('/logout', (req, res, next) => {
    //Bucle condicional por si el usuario desea cerrar sesión.
    if (req.user) {
    //Definimos una función para poder destruir la información del usuario. 
    req.logout(() => {
        req.session.destroy(() => {
            //Eliminamos la cookie de sesión al cerrar sesión y borramos la gase de datos. 
            res.clearCookie("connect.sid");
            return res.status(200).json("Hasta pronto!!");
        });
    });

    //Bucle condicional por si queremos cerrar sesión y no estamos logueados. 
    }else {
    return res.sendStatus(304); 
    }
  });

//Exportamos la función router que hemos creado para poder llamarla desde el index.js.
module.exports = router;