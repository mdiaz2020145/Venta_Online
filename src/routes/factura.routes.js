const express = require('express');
const facturaControlador = require('../controllers/factura.controller');



const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/generarFactura',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],facturaControlador.generarFactura);
api.get('/obtenerFacturas',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],facturaControlador.obtenerFactura);
module.exports = api;