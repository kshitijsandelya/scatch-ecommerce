const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: String,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    image: Buffer,
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
})

module.exports = mongoose.models.product || mongoose.model("product", ProductSchema);