const mongoose = require("mongoose")
const Schema = mongoose.Schema
const reviewSchema = new Schema({
    userId:{type:String,required:true},
    name: { type: String, required:true},
    review:{type:String,required:true},
    // product_id: [{ type: Schema.Types.ObjectId, ref: "product" }]
    product_id:{type:String}
})
const reviews = mongoose.model("review", reviewSchema)
module.exports = reviews