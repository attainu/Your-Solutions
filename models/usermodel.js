let mongoose=require('mongoose')

const Schema = mongoose.Schema; 
let user = new Schema({
  name:{type:String,trim:true,required:true},
  email:{type:String,trim:true,required:true,unique:true},
  password:{type:String,trim:true,required:true},
  token:{type:String,trim:true}
},{timestamps:true});

var yahoo = mongoose.model('users',user)

module.exports=yahoo