const mongoose = require('mongoose');

const OwnerSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    contact: Number,
    products: {
        type: Array,
        default: []
    },
    picture: String,
})

module.exports = mongoose.models.owner || mongoose.model("owner", OwnerSchema);