const express = require('express');
const categoriaControlador = require('../controllers/categoria.controller'); 


const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();
api.post('/agregarCategoria',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],categoriaControlador.agregarCategoria);
api.get('/obtenerCategorias',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],categoriaControlador.obtenerCategorias);
api.get('/obtenerCategoriaPorNombre/:nombreCategoria',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],categoriaControlador.obtenerCategoriasNombre);
api.put('/editarCategoria/:idCategoria',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],categoriaControlador.editarCategoria);
api.delete('/eliminarCategoria/:idCategoria',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],categoriaControlador.eliminarCategoriaDefault);
module.exports = api;