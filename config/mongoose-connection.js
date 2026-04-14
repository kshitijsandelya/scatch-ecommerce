const mongoose = require("mongoose");
const config = require("config")
const dbgr = require("debug")("development:mongoose")

mongoose.connect(`${config.get("MONGODB_URI")}/scatch`).then(() => {
    dbgr("connected to db");
}).catch((err) => {
    console.log(err);
})

module.exports = mongoose.connection;