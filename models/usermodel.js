let mongoose = require('mongoose')
const { compare, hash } = require("bcryptjs")
const { sign } = require("jsonwebtoken")
const Schema = mongoose.Schema;
let userSchema = new Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true, unique: true },
  password: { type: String, trim: true, required: true },
  token: { type: String, trim: true },
  verified:{type:Boolean,default:0}
}, { timestamps: true });
//-------------------------------------------------------------logic to find user by email and password 
userSchema.statics.findByEmailAndPassword = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid Credentials");
    const isMatched = await compare(password, user.password);
    if (!isMatched) throw new Error("Invalid Credentials");
    return user;
  } catch (err) {
    err.name = 'AuthError';
    throw err;
  }
};
//-------------------------------------------------------------------end
//--------------------------------------------------------logic to find user by email
userSchema.statics.find_by_email = async(email)=>{
  try{
    let temp1 = await User.find({email:email});
    if(!temp1)
    { 
      return "Invalid Credentials";
    }
    else{
      return temp1
    }
  } catch(err){
    err.name = 'AuthError';
    throw err;
  }
}
//-------------------------------------------------------------------end
//-------------------------------------------------------------logic to generate token 
userSchema.methods.generateToken = async function(){
  try {
    const user = this
    const token = await sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "30d"
    })
    user.token = token
    await user.save()
    return token
  }
  catch (err) {
    console.log(err.message)
  }
}
//-------------------------------------------------------------------end
//-----------------------------------------------------------logic to nullify token of a user 
userSchema.statics.nullifyToken = async (token)=>{
  try{
    const user = await User.findOne({token:token})
    user.token=null;
    user.save()
    return user
  }
  catch(err){
    console.log(err.message)
  }
}
//-------------------------------------------------------------------end
//-------------------------------------------------------------logic to verify user email 
userSchema.statics.find_user_by_token = async(token)=>{
  try{
    const user = await User.findOne({token:token})
    user.verified=true;
    user.save()
    return user
  }
  catch(err){
    console.log(err.message)
  }
}
//---------------------------------------------------------------------end
//-------------------------------------------------------------Pre middleware for hashing password
userSchema.pre("save", async function(next) {
  const user = this;
  try {
    if (user.isModified("password")) {
      const hashPassword = await hash(user.password, 10)
      user.password = hashPassword
      next()
    }
  }
  catch (err) {
    console.log(err.message)
    next(err)
  }
})
//---------------------------------------------------------------------end

var User = mongoose.model('users', userSchema)

module.exports = User