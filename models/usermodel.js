let mongoose = require('mongoose')
const { compare, hash } = require("bcryptjs")
const { sign } = require("jsonwebtoken")
const Schema = mongoose.Schema;
let userSchema = new Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true, unique: true },
  password: { type: String, trim: true, required: true },
  token: { type: String, trim: true }
}, { timestamps: true });

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
userSchema.methods.generateToken = async function(){
  try {
    const user = this
    const token = await sign({ id: user._id }, process.env.SECRETKEY, {
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

var User = mongoose.model('users', userSchema)

module.exports = User