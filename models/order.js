const mongoose = require('mongoose');
const schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
        product_id :String,
        quantity:String,
        buyername:String,
        buyeraddress:String,
        website:String,
});


module.exports = mongoose.model('orders',orderSchema);