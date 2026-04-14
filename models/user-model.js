const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   fullname: String,
   email: String,
   password: String,
   contact: Number,
   cart: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "product"
   }],
   orders: {
      typeof: Array,
      default: []
   },
   picture: String,
})

module.exports = mongoose.models.user || mongoose.model("user", UserSchema);