const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

//var Schema = mongoose.Schema; 

var facturaSchema = Schema({
    productosCompra:[{
        nombre:String,
        cantidad:Number,
        precio:Number,
        subTotal:Number
    }],
    total:Number,
    nit:String, 
    idUsuario:{type:Schema.Types.ObjectId,ref:'Usuarios'}

});

module.exports = mongoose.model('facturas',facturaSchema);