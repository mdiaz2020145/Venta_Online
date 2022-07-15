const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    nombre: String,
    email: String,
    password: String,
    rol: String,
    imagen:String,
    carrito:[{
        nombre: String,
        cantidad:Number,
        precio:Number,
        subtotal:Number
    }],
    totalCarrito:Number
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);