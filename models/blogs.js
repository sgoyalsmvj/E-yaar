const mongoose = require('mongoose');
const schema = mongoose.Schema;

const blogSchema = new mongoose.Schema({
        title: String,
        description: String,
        para1:String,
        para2:String,
        para3:String,
        image3: String,
        image2: String,
        image1: String,
        date: String
});


module.exports = mongoose.model('blog',blogSchema);