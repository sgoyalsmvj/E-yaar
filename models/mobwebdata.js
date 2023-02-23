const mongoose = require('mongoose');
const schema = mongoose.Schema;

const mobsiteSchema = new mongoose.Schema({
        bg1:String,
        bg2:String,
        bg3:String,
        sbg1:String,
        sbg2:String,
        sbg3:String,
        bg4:String

});


module.exports = mongoose.model('mobsite',mobsiteSchema);