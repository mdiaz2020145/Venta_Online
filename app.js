//Importaciones
const express = require('express');
const cors = require('cors');


var app = express();


//Importaciones Rutas
const UsuarioRutas = require('./src/routes/usuario.routes');
const productoRutas = require('./src/routes/producto.routes');
const categoriaRutas = require('./src/routes/categoria.routes');
const facturaRutas = require('./src/routes/factura.routes');

//Middlewares -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cabeceras
app.use(cors());

//CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api',UsuarioRutas,productoRutas,categoriaRutas,facturaRutas);

module.exports = app;
