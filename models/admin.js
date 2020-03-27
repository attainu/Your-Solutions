let mongoose = require('mongoose')
const {sign}=require("jsonwebtoken")
const Schema = mongoose.Schema;
let adminSchema = new Schema({ 
  email: { type: String, trim: true, required: true, unique: true },
  password: { type: String, trim: true, required: true },
  token: { type: String, trim: true },
}, { timestamps: true });
adminSchema.methods.generate_admin_Token = async function () {
  try {
    const admin = this
    SECRET_KEY = `${admin.email}-${new Date(admin.createdAt).getTime()}`
    const token = await sign({ id: admin._id }, SECRET_KEY, {
      expiresIn: "30d"
    })
    admin.token = token
    await admin.save()
    return token
  }
  catch (err) {
    console.log(err.message)
  }
}
adminSchema.statics.check_email_and_password = async (email, password) => {
  try {
    const admin = await Admin.findOne({ email: email,password:password });
    if (!admin) throw new Error("Invalid Credentials");
    return admin;
  } catch (err) {
    err.name = 'AuthError';
    throw err;
  }
}
//-------------------------------------------------------------------end
//-----------------------------------------------------------logic to nullify token of a admin 
adminSchema.statics.nullify_admin_Token = async (token) => {
  try {
    const admin = await Admin.findOne({ token: token })
    admin.token = null;
    admin.save()
    return admin
  }
  catch (err) {
    console.log(err.message)
  }
}
const Admin = mongoose.model('admin', adminSchema)

module.exports = Admin