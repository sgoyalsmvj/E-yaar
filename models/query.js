const mongoose = require('mongoose');
const schema = mongoose.Schema;

const querySchema = new mongoose.Schema({
       name:String,
       mail:String,
       subject:String,
       message:String
});


module.exports = mongoose.model('query',querySchema);