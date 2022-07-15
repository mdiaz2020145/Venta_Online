const express = require('express');
const productoControlador = require('../controllers/producto.controller'); 


const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarProducto',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],productoControlador.agregarProducto);
api.put('/editarProducto/:idProducto',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],productoControlador.EditarProducto);
api.put('/editarStock/:idProducto',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],productoControlador.stockDelProducto);
api.get('/obtenerProductos',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],productoControlador.ObtenerProducto);
api.get('/obtenerProductoNombre/:nombreProducto',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],productoControlador.obtenerProductoNombre);
module.exports = api;