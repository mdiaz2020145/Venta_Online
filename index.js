const mongoose = require('mongoose');
const app = require('./app');
UsuarioController = require('./src/controllers/usuario.controller');
var categoria = require('./src/models/categoria.model');

mongoose.Promise = global.Promise;                                                                  //function (){}
mongoose.connect('mongodb://localhost:27017/IN6BM_proyectoFinal', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos.");

    app.listen(3000, function () {
        console.log("Esta corriendo en el puerto 3000!")
    })

    //Regristrar Admin
    UsuarioController.registrarAdmin();

    categoria.find({nombre:'Categoria general'},(err,categoriaEncontrada)=>{
        if(categoriaEncontrada.length == 0){
            categoria.create({nombre : 'Categoria general'})
        }else{
            console.log('La categoria general ya esta creada');
        }
    })

}).catch(error => console.log(error));