const mongoose = require('mongoose');
const cart = require('../models/cart');

inCart(productID = 0) {
    let found = false;
    this.data.items.forEach(item => {
       if(item.id === productID) {
           found = true;
       }
    });
    return found;
};
calculateTotals() {
    this.data.totals = 0;
    this.data.items.forEach(item => {
        let price = item.price;
        let qty = item.qty;
        let amount = price * qty;

        this.data.totals += amount;
    });
    this.setFormattedTotals();
}

setFormattedTotals() {
    let format = new Intl.NumberFormat(config.locale.lang, {style: 'currency', currency: config.locale.currency });
    let totals = this.data.totals;
    this.data.formattedTotals = format.format(totals);
}