//importaciones
const express = require('express');
const producto = require('../models/producto.model');
const categoria = require('../models/categoria.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


//Agregar Categoria 
function agregarCategoria(req, res){
    var parametros = req.body; 
    var categoriaModels = new categoria(); 

    if(parametros.nombre){
        categoriaModels.nombre = parametros.nombre; 

    }else{
        return res.status(500).send({mensaje:'Error'})
    }

    categoria.find({nombre:parametros.nombre},(err,categoriaGuardada)=>{
        if(categoriaGuardada.length == 0){
            categoriaModels.save((err,categoriaGuardada)=>{
                if(err) res.status(500).send({mensaje:'Error en la peticion'});
                if(!categoriaGuardada)return res.status(404).send({mensaje:'La categoria no se agrego'});
                return res.status(200).send({categoria:categoriaGuardada});
            })
        }
    })
}

//Obtener Categorias 
function obtenerCategorias(req,res){
    categoria.find((err,categoriaEncontrada)=>{
        for(let i = 0; i<categoriaEncontrada.length; i++){
            console.log(categoriaEncontrada[i].nombre)
        }
        return res.status(200).send({categoria:categoriaEncontrada});
    })
}

//Obtener categoria por nombre 
function obtenerCategoriasNombre(req,res){
    var nombreCa= req.params.nombreCategoria;
    
    categoria.find({nombre:{$regex:nombreCa,$options:'i'}},(err,categoriaNombreEncontrado)=>{
        if(err) return res.status(500).send({message: "error en la peticion"});
        if(!categoriaNombreEncontrado) return res.status.send({mensaje:'Error al encontrar el producto'})
        return res.status(200).send({categoria: categoriaNombreEncontrado})
    })
}

//Editar categoria 
function editarCategoria(req,res){
    var categoriaID = req.params.idCategoria; 
    var paramentros = req.body; 

    categoria.findByIdAndUpdate({_id:categoriaID,nombre:paramentros.nombre},paramentros,{new:true},(err,categoriaEditada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!categoriaEditada) return res.status(400).send({mensaje: 'No se puede editar categoria'});
        return res.status(200).send({categoria: categoriaEditada});
    })
}


//Eliminar categoria default
function eliminarCategoriaDefault(req,res){
    var categoriaID = req.params.idCategoria;

    categoria.findOne({nombre:'Categoria general'},(err,categoriaE)=>{
    producto.updateMany({idCategoria:categoriaID},{idCategoria:categoriaE._id},(err,categoriaEliminada)=>{
        categoria.findByIdAndDelete(categoriaID,(err,categoriaE)=>{
            if (err)return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!categoriaE) return res.status(404).send({mensaje:"no se puede eliminar la categoria"});
            return res.status(200).send({ categoria: categoriaE });
        })
    })
    })

}

module.exports={
agregarCategoria,
obtenerCategorias,
obtenerCategoriasNombre,
editarCategoria,
eliminarCategoriaDefault

}