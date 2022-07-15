const mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var productoSchema = Schema({
    nombre: String,
    stock: Number,
    precio: Number,
    idCategoria:{type: Schema.Types.ObjectId, ref:'categoria'}
});

module.exports = mongoose.model('productos',productoSchema);