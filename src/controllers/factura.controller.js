// importaciones
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const factura = require('../models/factura.model');
const usuario = require('../models/usuario.model');


//Generar Factura 
function generarFactura(req,res){
    var cliente = req.user.sub; 
    var facturaModel = new factura(); 

    usuario.findById(cliente,(err,facturaUsuarioEncontrado)=>{
        facturaModel.productosCompra = facturaUsuarioEncontrado.carrito; 
        facturaModel.total = facturaUsuarioEncontrado.totalCarrito; 
        facturaModel.nit = req.body.nit;
        facturaModel.idUsuario = req.user.sub;


        facturaModel.save((err,facturaGuardada)=>{
            usuario.findByIdAndUpdate(cliente,{$set:{carrito:[]},totalCarrito:0},{new:true},(err,facturaVacia)=>{
                    return res.status(200).send({factura:facturaGuardada})
            })
        })

    })
}


//Obtener Factura del usuario 
function obtenerFactura(req,res){
    factura.find((err,facturaEncontrada)=>{
        if(err)return res.status(500).send({mensaje:'Error en la peticion'})
        if(!facturaEncontrada) return res.status.send({mensaje:'Factura no encontrada'})
        return res.status(200).send({factura:facturaEncontrada});
    })
}



module.exports={
    generarFactura,
    obtenerFactura,

}
