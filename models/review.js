const mongoose = require("mongoose")
const Schema = mongoose.Schema
const orderSchema = new Schema({
    user_id: [{ type: Schema.Types.ObjectId, ref: "users" }],
    product_id: [{ type: Schema.Types.ObjectId, ref: "product" }]
})
const orders = mongoose.model("order", orderSchema)
module.exports = orders