const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller'); 

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');

const api = express.Router();

//Lado del administrador 
api.post('/login',usuarioControlador.login);
api.post('/registrarUsuarios',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],usuarioControlador.registrarUsuario);
api.put('/editarCliente/:idUsuario',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],usuarioControlador.editarCliente);
api.delete('/eliminarCliente/:idUsuario',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],usuarioControlador.eliminarCliente);

//Lado del cliente 
api.post('/registrarCliente',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],usuarioControlador.registrarCliente);
api.put('/editarCuenta/:idUsuario',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],usuarioControlador.editarCuenta);
api.delete('/eliminarCuenta/:idUsuario',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],usuarioControlador.eliminarCuenta);
api.put('/agregarCarrito',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],usuarioControlador.agregarProductoDelCarrito);
api.put('/eliminarCarrito',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],usuarioControlador.eliminarCarrito);
module.exports = api;