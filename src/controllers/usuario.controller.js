// importaciones
const express = require('express');
const Usuario = require('../models/usuario.model');
const producto = require('../models/producto.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { findByIdAndDelete } = require('../models/usuario.model');
//const cli = require('nodemon/lib/cli');


//Regristrar Admin
function registrarAdmin(req, res) {
    //var parametros = req.body;
    var usuarioModelo = new Usuario();    
        usuarioModelo.nombres = 'ADMIN';
        usuarioModelo.email = 'ADMIN';
        usuarioModelo.rol = 'ROL_ADMINISTRADOR';
    
    Usuario.find({ email: 'ADMIN', nombres: 'ADMIN'}, (err, usuarioGuardado) => {
        if (usuarioGuardado.length == 0) {
            bcrypt.hash("123456",null, null, (err, passswordEncypt) => {
                usuarioModelo.password = passswordEncypt
                usuarioModelo.save((err, usuarioGuardado) => {
                    console.log(err)
                })
            })
        } else {
            console.log('El usuario admin ya esta creado')
        }
    })
}

//Registrar Cliente/la del usuario o cliente
function registrarCliente(req,res){
    var parametros = req.body;
    var usuarioModels = new Usuario();

    if({nombre:parametros.nombre,email:parametros.email,password:parametros.password,rol:parametros.rol}){
        usuarioModels.nombre = parametros.nombre;
        usuarioModels.email = parametros.email;
        usuarioModels.password = parametros.password;
        usuarioModels.rol = 'ROL_CLIENTE';

        Usuario.find({email:parametros.email},(err,clienteRegistrado)=>{
            if(clienteRegistrado.length == 0){
                bcrypt.hash(parametros.password, null,null, (err, passwordEncriptada)=>{
                    usuarioModels.password = passwordEncriptada;
                    usuarioModels.save((err, clienteGuardado) => {
                        if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                        if(!clienteGuardado) return res.status(404).send({mensaje: 'No se agrego al usuario'});
                        return res.status(201).send({usuarios: clienteGuardado});
                })

            })
        }else{
            return res.status(500).send({mensaje: 'Este correo, ya  se encuentra utilizado'});
        }

    })
}
}


//Registrar Usuario/lado del administrador
function registrarUsuario(req,res){
    var parametros = req.body;
    var usuarioModels = new Usuario();

    if({nombre:parametros.nombre,email:parametros.email,password:parametros.password,rol:parametros.rol}){
        usuarioModels.nombre = parametros.nombre;
        usuarioModels.email = parametros.email;
        usuarioModels.password = parametros.password;
        usuarioModels.rol = parametros.rol;

        Usuario.find({email:parametros.email},(err,clienteRegistrado)=>{
            if(clienteRegistrado.length == 0){
                bcrypt.hash(parametros.password, null,null, (err, passwordEncriptada)=>{
                    usuarioModels.password = passwordEncriptada;
                    usuarioModels.save((err, clienteGuardado) => {
                        if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                        if(!clienteGuardado) return res.status(404).send({mensaje: 'No se agrego al usuario'});
                        return res.status(201).send({usuarios: clienteGuardado});
                })

            })
        }else{
            return res.status(500).send({mensaje: 'Este correo, ya  se encuentra utilizado'});
        }

    })
}
}

//Editar Cliente/usuario 
function editarCliente(req, res) {
    var usuarioID = req.params.idUsuario;
    var paramentros = req.body;


    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Usuario.findById(usuarioID, (err, clienteEliminado) => {
            if (clienteEliminado.rol == "ROL_CLIENTE") {
                Usuario.findByIdAndUpdate({ _id: usuarioID, email: paramentros.email, password: paramentros.password, rol: paramentros.rol }, paramentros,
                    { new: true }, (err, usuarioActualizado) => {
                        if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
                        if (!usuarioActualizado) return res.status(404).send({ mensaje: 'No se agrego al usuario' });
                        return res.status(200).send({ usuario: usuarioActualizado });
                    });
            } else {
                return res.status(500).send({ mensaje: "Administradores no se editan" })
            }
        })
    }
}


//Eliminar cliente/usuario 
function eliminarCliente(req,res){
    var usuarioID = req.params.idUsuario; 
    var parametros = req.body; 

    if(req.user.rol == 'ROL_ADMINISTRADOR'){
        Usuario.findById(usuarioID,(err,clienteEliminado)=>{
            if (clienteEliminado.rol == "ROL_CLIENTE") {
                Usuario.findByIdAndDelete({ _id: usuarioID }, parametros, (err, UsuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
                    if (!UsuarioEliminado) return res.status(400).send({ mensaje: 'No se elimino el usuario' });
                    return res.status(200).send({ usuarios: UsuarioEliminado });
            });
        }else{
            return res.status(500).send({mensaje:"Administradores no se eliminan"})
        }
    })
}

}

//LOGIN 
function login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    if ( verificacionPassword ) {
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    })
}

//FUNCIONES DEL CLIENTE 

//Editar cliente de parte del propio cliente 
function editarCuenta(req,res){
    var usuarioID = req.params.idUsuario;
    var paramentros = req.body;

    if ( usuarioID !== req.user.sub ) return res.status(500).send({ mensaje: 'No puede editar otros usuarios'});

    Usuario.findByIdAndUpdate({_id:usuarioID},paramentros,{new:true},(err,CuentaEditada)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!CuentaEditada) return res.status(404).send({mensaje:'Error en editar la cuenta'});

        return res.status(500).send({usuario:CuentaEditada});
    })
}


//Eliminar cliente de parte del propio cliente
function eliminarCuenta(req,res){
    var usuarioID = req.params.idUsuario;
    var parametros = req.body;

    if ( usuarioID !== req.user.sub ) return res.status(500).send({ mensaje: 'No puede eliminar otros usuarios'});
    Usuario.findByIdAndDelete({ _id: usuarioID }, parametros, (err, cuentaEliminada) => {
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!cuentaEliminada) return res.status(404).send({mensaje:'Error en editar la cuenta'});

        return res.status(500).send({usuario:cuentaEliminada});

    });    

}


//Agregar productos al carrito 
function agregarProductoDelCarrito(req,res){
    var cliente = req.user.sub; 
    var parametros = req.body;
    
    producto.findOne({nombre:parametros.nombre},(err,productoEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!productoEncontrado) return res.status(404).send({mensaje:'Error al encontrar el producto'});
        
        Usuario.find({_id:cliente},{carrito:{$elementMatch:{nombre:parametros.nombre}}},(err,res)=>{
            if(res == null){
                Usuario.findByIdAndUpdate(cliente,{
                    $push:{
                        carrito:{
                            nombre: parametros.nombre,
                            cantidad:parametros.cantidad,
                            precio: productoEncontrado.precio,
                            subtotal:productoEncontrado.precio * parametros.cantidad
                        }
                    }
                },{new:true},(err,usuarioCarrito)=>{
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if(!usuarioCarrito) return res.status(404).send({mensaje:'Error al tratar de agregar el producto'});

                    let totalCarrito = 0;

                    for(let i=0; i<usuarioCarrito.carrito.length; i++){
                        totalCarrito = totalCarrito + usuarioCarrito.carrito[i].subtotal
                    }

                    Usuario.findByIdAndUpdate(cliente,{totalCarrito:totalCarrito},{new:true},(err,usuarioCarrito)=>{
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                        if (!usuarioCarrito) return res.status(404).send({ mensaje: 'Error al editar el carrito'});
                        //return res.status(200).send({producto:usuarioCarrito})
                    })
                }) 
            }else{
                Usuario.findByIdAndUpdate({$inc:{cantidad:parametros.cantidad}},{new:true},(err,carritoModificado)=>{
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!carritoModificado) return res.status(404).send({ mensaje: 'Error al editar el carrito'});
                    return res.status(200).send({producto:carritoModificado})

                })
            }
        })
        //return res.status(500).send({mensaje:'El producto se añadio al carrito correctamente'});
        Usuario.find({_id:cliente},(err,UsuarioEncontrado)=>{
            if(err) return res.status(500).send({mensaje:'Error en la peticion'});
            if(!UsuarioEncontrado) return res.status(404).send({mensaje:'Error al encontrar al usuario'});
            return res.status(200).send({Usuario:UsuarioEncontrado})
        })
    
    })
}

//Eliminar productos del carrito 
function eliminarCarrito(req,res){
    var cliente = req.user.sub; 
    var parametros = req.body;
    Usuario.findByIdAndUpdate(cliente,{$pull:{carrito:{nombre:parametros.nombre}}},{new:true},(err,usuarioEliminado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!usuarioEliminado) return res.status(404).send({mensaje:'Error al encontrar el carrito'});

        let totalCarrito = 0;

        for(let i =0; i<usuarioEliminado.carrito.length;i++){
            totalCarrito = totalCarrito + usuarioEliminado.carrito[i].subtotal;
        }

        Usuario.findByIdAndUpdate(cliente,{totalCarrito:totalCarrito},{new:true},(err,totalCarritoActualizado)=>{
            if(err) return res.status(500).send({mensaje:'Error en la peticion'});
            if(!totalCarritoActualizado) return res.status(404).send({mensaje:'Error al actualizar el carrito'});

            return res.status(200).send({carrito:totalCarritoActualizado})
        })
    })
}

module.exports ={
    registrarAdmin,
    registrarCliente,
    registrarUsuario,
    editarCliente,
    eliminarCliente,
    login,
    editarCuenta,
    eliminarCuenta,
    agregarProductoDelCarrito,
    eliminarCarrito
}