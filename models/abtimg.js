const mongoose = require('mongoose');
const schema = mongoose.Schema;

const abtimgSchema = new mongoose.Schema({
       img:String
});


module.exports = mongoose.model('abtimg',abtimgSchema);