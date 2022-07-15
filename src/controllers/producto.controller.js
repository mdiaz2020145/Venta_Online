// importaciones
const express = require('express');
const producto = require('../models/producto.model');
const categoria = require('../models/categoria.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

//Agregar Producto 
function agregarProducto(req,res){
    var parametros = req.body;
    var productoModel = new producto();

    if(parametros.nombre,parametros.stock,parametros.precio){
        productoModel.nombre = parametros.nombre;
        productoModel.stock = parametros.stock;
        productoModel.precio = parametros.precio;
        productoModel.idCategoria = parametros.idCategoria;

    }else{
        return res.status(500).send({mensaje:'Error'})
    }

    producto.find({nombre:parametros.nombre, stock:parametros.stock,precio:parametros.precio,idCategoria:parametros.idCategoria},(err,productoGuardado)=>{

        //if(productoGuardado._id == parametros.idCategoria){
        if(productoGuardado.length == 0){
            productoModel.save((err,productoGuardado)=>{
                if(err) res.status(500).send({mensaje:'Error en la peticion'});
                if(!productoGuardado)return res.status(404).send({mensaje:'El producto no se agrego'});
                return res.status(200).send({producto:productoGuardado});
            })

        }else{
            return res.status(500).send({mensaje:'El producto ya existe'})
        }
    /*}else{
        return res.status(500).send({mensaje:'La categoria no existe'})
    }*/

    })
        
}  


//Obtener todos los productos 
function ObtenerProducto(req,res){
    producto.find((err,productoEncontrado)=>{
        for(let i = 0; i<productoEncontrado.length; i++){
            console.log(productoEncontrado[i].nombre)
        }
        return res.status(200).send({producto:productoEncontrado});
    })
}

//obtener producto por el nombre 
function obtenerProductoNombre(req,res){
    var nombreProd = req.params.nombreProducto 

    producto.find({nombre:{$regex:nombreProd,$options:'i'}},(err,productoNombreEncontrado)=>{
        if(err) return res.status(500).send({message: "error en la peticion"});
        if(!productoNombreEncontrado) return res.status.send({mensaje:'Error al encontrar el producto'})
        return res.status(200).send({producto: productoNombreEncontrado})
    })
}

//Editar Producto 
function EditarProducto(req,res){
    var idProduct = req.params.idProducto;
    var paramentros = req.body;
    producto.findByIdAndUpdate({_id:idProduct,nombre:paramentros.nombre,stock:paramentros.stock,precio:paramentros.precio,idCategoria:paramentros.idCategoria},
        paramentros,{new:true},(err,productoEditado)=>{
            if(err) res.status(500).send({mensaje:'Error en la peticion'});
            if(!productoEditado)return res.status(404).send({mensaje:'El producto no se edito'});
            return res.status(200).send({producto:productoEditado});

        })
    
}

//Restar o sumar stock del producto
function stockDelProducto(req,res){
    var idProduct = req.params.idProducto;
    var paramentros = req.body;

    producto.findByIdAndUpdate(idProduct,{$inc:{stock:paramentros.stock}},{new:true},(err,stockModificado)=>{
        if(err) res.status(500).send({mensaje:'Error en la peticion'});
        if(!stockModificado)return res.status(404).send({mensaje:'El stock no se edito'});
        return res.status(200).send({producto:stockModificado});
    })
}




module.exports={
        agregarProducto,
        EditarProducto,
        stockDelProducto,
        ObtenerProducto,
        obtenerProductoNombre   
}

    



