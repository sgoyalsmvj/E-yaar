const mongoose = require('mongoose');
const schema = mongoose.Schema;

const aboutSchema = new mongoose.Schema({
       para:String
});


module.exports = mongoose.model('about',aboutSchema);