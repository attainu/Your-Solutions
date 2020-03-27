const mongoose = require("mongoose")
const Schema =mongoose.Schema
const productSchema= new Schema({
    category:{type:String,required:true},
    review:[{type:Schema.Types.ObjectId,ref:"review"}],
    gender:{type:String,required:true},
    image_url1:{type:String,required:true},
    image_url2:{type:String,required:true},
    image_url3:{type:String,required:true},
    image_url4:{type:String,required:true},
    details:{type:String,required:true},
    color:{type:String,required:true},
    price:{type:Number,required:true},
    size:{type:Number,required:true},
    innerMaterial:{type:String},
    shoe_type:{type:String},
    upper_Material:{type:String},
    brand:{type:String,required:true},
    sole_material:{type:String},
    style_code:{type:Number},
})
productSchema.pre("remove", function(next) {
    const product=this
    try{
    products.deleteone({_id:product._id} )
    next();
    }
    catch(err) {
        next(err);
      };
  });
const products = mongoose.model("product",productSchema)
module.exports=products