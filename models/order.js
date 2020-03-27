const mongoose = require("mongoose")
const Schema = mongoose.Schema
const reviewSchema = new Schema({
    user_id: [{ type: Schema.Types.ObjectId, ref: "users" }],
    product_id: [{ type: Schema.Types.ObjectId, ref: "product" }],
    review: { type: String }
})
const reviews = mongoose.model("review", reviewSchema)
module.exports = reviews