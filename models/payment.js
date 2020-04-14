const mongoose = require("mongoose")
const Schema = mongoose.Schema
const payment_schema = new Schema({
    user_id: { type: String, required: true},    
    order_id:{type:String,required:true},
    razor_payment_id:{type:String},
    razor_signature:{type:String}
},{timestamps:true})
const payment = mongoose.model("razorpay", payment_schema)
module.exports = payment

