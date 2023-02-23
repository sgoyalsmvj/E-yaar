const mongoose = require('mongoose');
const schema = mongoose.Schema;
const product = require("./products");



const cartSchema = new mongoose.Schema({
    session: String,
    items: [{
        paintingID:String,
        number: Number
    }],
    total: Number
    // description: String,
    
});


module.exports = mongoose.model('Cart',cartSchema);