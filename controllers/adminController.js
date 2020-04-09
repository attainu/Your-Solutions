const admins = require("../models/admin")
const product = require("../models/product")
const fs = require('fs')
//requiring cloudinary
const cloudinary = require('../utils/cloudinary')
module.exports = {
   post: {
      // -------------------------------admin login---------------
      async login_admin(req, res) {
         try {
            const { email, password } = req.body
            if (!email || !password)
               return res.status(400).send("Incorrect Credentials")
            const admin = await admins.check_email_and_password(email, password)
            const accesToken = await admin.generate_admin_Token()
            res.status(201).json({
               statusCode: 201,
               token: accesToken
            })
         }
         catch (err) {
            console.log(err.message)
            if (err.message == "Invalid Credentials") return res.status(400).send("Invalid Credentials")
            return res.send("ServerError")
         }
      },
      // -------------------products added by admin
      async add_product(req, res) {
         try {
            let temp1 = req.body
            let img_url = [];
            const adminToken = req.header("Authorization")
            const admin = await admins.find({token:adminToken})
            if(admin){
            fs.readdir('uploads/', (err, data) => {
               if (err) { throw err }
               let temp = data
               img_url.length = 0;
               for (let i = 0; i < temp.length; i++) {
                  if (/.jpg$/.test(temp[i])) {
                     cloudinary.uploader.upload(`uploads/${temp[i]}`, (err, result) => {
                        if (err) { throw err }
                        else {
                           img_url.push(result.secure_url)
                           fs.unlink(`uploads/${temp[i]}`, (err) => { if (err) { throw err } else { console.log('deleted') } })
                        }
                     });
                  }
                  else if (/.jpeg$/.test(temp[i])) {
                     cloudinary.uploader.upload(`uploads/${temp[i]}`, (err, result) => {
                        if (err) { throw err }
                        else {
                           img_url.push(result.secure_url)
                           fs.unlink(`uploads/${temp[i]}`, (err) => { if (err) { throw err } else { console.log('deleted') } })
                        }
                     });
                  }
                  else if (/.png$/.test(temp[i])) {
                     cloudinary.uploader.upload(`uploads/${temp[i]}`, (err, result) => {
                        if (err) { throw err }
                        else {
                           img_url.push(result.secure_url)
                           fs.unlink(`uploads/${temp[i]}`, (err) => { if (err) { throw err } else { console.log('deleted') } })
                        }
                     });
                  }
                  else if (/.webp$/.test(temp[i])) {
                     cloudinary.uploader.upload(`uploads/${temp[i]}`, (err, result) => {
                        if (err) { throw err }
                        else {
                           img_url.push(result.secure_url)
                           fs.unlink(`uploads/${temp[i]}`, (err) => { if (err) { throw err } else { console.log('deleted') } })
                        }
                     });
                  }

               }
            })
            setTimeout(() => {
               console.log(img_url)
               temp1.image_url1 = img_url[0]
               temp1.image_url2 = img_url[1]
               temp1.image_url3 = img_url[2]
               temp1.image_url4 = img_url[3]
               let newuser = product({ ...temp1 })
               let data159 = async () => {
                  let val159 = await newuser.save()
                  res.json(val159)
               }
               data159();
            }, 10000);
         }
         else res.send("Kindly login first")
         } catch (err) {
            if(err==MongoError) return res.send("stylecode should be unique")
            console.log(err)
            return res.send("serverError")
         }
      },
   },
   // -----------------------admin logout--------------
   delete1: {
      async logout_admin(req, res) {
         try {
            token = req.params.adminToken
            const admin = await admins.nullify_admin_Token(token)
            res.json(admin)
         }
         catch (err) {
            console.log(err.message)
            res.status(500).send("server error")
         }
      }
   }
}