const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
        name:String,
        number:String,
        mail:String,
        aid:String,
        fid:String,
        mid:String,
        pass:String

});


module.exports = mongoose.model('User',userSchema);