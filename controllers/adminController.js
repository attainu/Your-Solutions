const admins =require("../models/admin")
const product=require("../models/product")
const fs=require('fs')
//requiring cloudinary
const cloudinary=require('../utils/cloudinary')

// const upload = require('../utils/multer')

module.exports={
    post:{
        async login_admin(req,res){
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
      async add_product(req,res){
         try {
            let temp1 = req.body 
            console.log(req.headers.authorization)
            fs.readdir('uploads/',(err,data)=>{
               if(err){throw err}
               let temp=data[0]
               let img_url=undefined
               if(temp=='product_img.jpg'){
                  cloudinary.uploader.upload("uploads/product_img.jpg",(err,result)=>{if(err){throw err}
                     else{
                        // console.log(result)
                        img_url=result.secure_url
                        fs.unlink('uploads/product_img.jpg',(err)=>{if(err){throw err}else{console.log('deleted')}})
                  }});
               }
               else if(temp=='product_img.jpeg'){
                  cloudinary.uploader.upload("uploads/product_img.jpeg",(err,result)=>{if(err){throw err}
                     else{
                        // console.log(result)
                        img_url=result.secure_url
                        fs.unlink('uploads/product_img.jpeg',(err)=>{if(err){throw err}else{console.log('deleted')}})
                  }});
               }
               else if(temp=='product_img.png'){
                  cloudinary.uploader.upload("uploads/product_img.png",(err,result)=>{if(err){throw err}
                     else{
                        // console.log(result)
                        img_url=result.secure_url
                        fs.unlink('uploads/product_img.png',(err)=>{if(err){throw err}else{console.log('deleted')}})
                  }});
               }
               else if(temp=='product_img.webp'){
                  cloudinary.uploader.upload("uploads/product_img.webp",(err,result)=>{if(err){throw err}
                     else{
                        // console.log(result)
                        img_url=result.secure_url
                        fs.unlink('uploads/product_img.webp',(err)=>{if(err){throw err}else{console.log('deleted')}})
                  }});
               }
               setTimeout(() => {
                  // console.log(img_url)
                  temp1.image_url1=img_url
                  let newuser = product({...temp1})
                  let data159 = async()=>{
                     let val159=await newuser.save()
                     await console.log(val159)
                  }
                  data159();
               }, 3000);                  
            })
                     
            res.send('ok')
         } catch (err) {
           console.log(err)
         }
      },
    },
    delete1:{
        async logout_admin(req,res){
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