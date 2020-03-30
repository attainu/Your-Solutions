const mongoose = require("mongoose")
const Schema = mongoose.Schema
const productSchema = new Schema({
    name:{type:String,required:true},
    category: { type: String, required: true },
    gender: { type: String, required: true },
    image_url1: { type: String, required: true },
    image_url2: { type: String },
    image_url3: { type: String },
    image_url4: { type: String },
    details: [{
        size: { type: String, required: true },
        price:{type:String,required:true},
        colors: [{
            color: { type: String, required: true },
            quantity: { type: String, required: true }
        }]
    }],
    inner_material: { type: String },
    shoe_type: { type: String },
    upper_material: { type: String },
    brand: { type: String, required: true },
    sole_material: { type: String },
    style_code: { type: Number },
})
productSchema.pre("remove", function (next) {
    const product = this
    try {
        products.deleteone({ _id: product._id })
        next();
    }
    catch (err) {
        next(err);
    };
});
const products = mongoose.model("product", productSchema)
module.exports = products