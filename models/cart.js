const mongoose = require("mongoose")
const Schema = mongoose.Schema
const cartSchema = new Schema({
    user_id: { type: String, requies: true },
    product: { product_id: { type: Schema.Types.ObjectId, ref: "product" }, quantity: { type: Number }, size: { type: Number }, color: { type: String } }
})
const cartOrder = mongoose.model("cart", cartSchema)
module.exports = cartOrder