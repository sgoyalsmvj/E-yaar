const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
        name:String,
        price : String,
        user:String,
        // title: String,
        // image1:String,
        // image2:String,
        // image3:String,
        // original:Number,
        // prints:Number,
        // copy: Number,
        // priceo: Number,
        // dolpriceo:Number,
        // pricec: Number,
        // dolpricec:Number,
        // currency:String,
        // description: String,
        // reviews:[
        //         {
        //                 type: mongoose.Schema.Types.ObjectId,
        //                 ref : 'Review'
        //         }
        // ]
});


module.exports = mongoose.model('products',productSchema);