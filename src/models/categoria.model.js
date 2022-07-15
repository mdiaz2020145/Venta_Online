const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var categoriaSchema = Schema({
    nombre:String,
});
module.exports = mongoose.model('categoria',categoriaSchema);