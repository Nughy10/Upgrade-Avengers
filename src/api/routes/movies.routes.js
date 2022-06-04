//CREACIÓN DE LAS RUTAS PARA HACER UN CRUD (./api/routes/movies.routes.js)

//Definimos una variable que requiera la libreria "express".
//(libreria que nos ayuda a crear una Api Rest (Gestionar metodos propios de la libreria)).
const express = require("express");

//Definimos una variable para poder crear distintas rutas.
const router = express.Router();

//Definimos una variable que requiera el modelo de movies.
const moviesSchema = require("../models/movies.model");

//POST - CREATE
//Definimos una función que crea una ruta POST (CREATE) con los parámetros de Request, Response y Next.
router.post("/movies", (req, res, next) => {
  //Definimos una variable objeto con los atributos a recojer (con REQ) del modelo creados en ./api/models.
  const movie = new moviesSchema({
    name: req.body.name,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date,
  });

  //Definimos una función asíncrona que guarda la variable objeto anterior en la base de datos.
  //Convertidor a formato .json, mensaje de validación y resultado de la creación (del POST).
  movie.save().then((response) => {
    res.status(201).json({
        message: "movie successfully created!",
        result: response,
    });
    //Mediante el catch manejaremos los posibles errores de la creación (del POST).
    }).catch((error) => {
        res.status(500).json({
            error: error,
      });
    });
});

//GET - READ
//Definimos una función que crea una ruta GET (READ) con los parámetros de Request y Response.
router.route("/movies").get((req, res) => {
  //Definimos una función para leer los datos de la base de datos creada en Mongo Atlas.
  moviesSchema.find((error, response) => {
    //Condicional para el error de lectura y, de lo contrario, lectura de la base de datos.
    if (error) {
      return next(error);
    } else {
      res.status(200).json(response);
    }
  });
});

//PUT - UPDATE
//Definimos una función que actualiza una ruta PUT (UPDATE) con los parámetros de Request, Response y Next.
router.put("/movies", (req, res, next) => {
    //Definimos una varible que recoje el id del documento que queremos actualizar. 
    const id = req.body.id;
    //Definimos una variable objeto con los atributos a recojer (con REQ) del modelo creados en ./api/models.
    const putMovie = new moviesSchema({
        name: req.body.name,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date,
      });
    //Cambiamos la id que habia en la base de datos por la id que queremos actualizar. 
    putMovie._id = id;
    //Definimos una función asíncrona que actualiza la variable objeto anterior en la base de datos.
    //Convertidor a formato .json, mensaje de validación y resultado de la actualización (del PUT).
    moviesSchema.findByIdAndUpdate(id, putMovie).then((response) => {
        res.status(201).json({
            message: "movie successfully updated!",
            result: response,
        });
    //Mediante el catch manejaremos los posibles errores de la actualización (del PUT).
    }).catch((error) => {
        res.status(500).json({
            error: error,
      });
    });
});

//DELETE - DELETE
//Definimos una función que elimina una ruta DELETE (DELETE) con los parámetros de Request, Response y Next.
router.delete("/movies", (req, res, next) => {
    //Definimos una varible que recoje el id del documento que queremos eliminar. 
    const id = req.body.id;
    //Definimos una función asíncrona que elimina la variable objeto anterior en la base de datos.
    //Convertidor a formato .json, mensaje de validación y resultado de la eliminación (del DELETE).
    moviesSchema.findByIdAndDelete(id).then((response) => {
        res.status(201).json({
            message: "movie successfully deleted!",
            result: response,
        });
    //Mediante el catch manejaremos los posibles errores de la eliminación (del DELETE).
    }).catch((error) => {
        res.status(500).json({
            error: error,
        });
    });
})

//Exportamos la función router que hemos creado para poder llamarla desde el index.js
module.exports = router;
