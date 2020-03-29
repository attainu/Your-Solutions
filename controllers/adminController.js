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
            let img_url=[];
            console.log(req.headers.authorization)
            fs.readdir('uploads/',(err,data)=>{
               if(err){throw err}
               let temp=data
               // console.log(temp)
               img_url.length=0;
               // console.log(temp.length)
               for(let i=0;i<temp.length;i++){
               if(/.jpg$/.test(temp[i])){
                  // console.log(temp[i])
                  cloudinary.uploader.upload(`uploads/${temp[i]}`,(err,result)=>{if(err){throw err}
                     else{
                        // console.log(result.secure_url)
                        img_url.push(result.secure_url)
                        fs.unlink(`uploads/${temp[i]}`,(err)=>{if(err){throw err}else{console.log('deleted')}})
                  }});
               }
               else if(/.jpeg$/.test(temp[i])){
                  // console.log(temp[i])
                  cloudinary.uploader.upload(`uploads/${temp[i]}`,(err,result)=>{if(err){throw err}
                     else{
                        // console.log(result.secure_url)
                        img_url.push(result.secure_url)
                        fs.unlink(`uploads/${temp[i]}`,(err)=>{if(err){throw err}else{console.log('deleted')}})
                  }});
               }
               else if(/.png$/.test(temp[i])){
                  // console.log(temp[i])
                  cloudinary.uploader.upload(`uploads/${temp[i]}`,(err,result)=>{if(err){throw err}
                     else{
                        // console.log(result.secure_url)
                        img_url.push(result.secure_url)
                        fs.unlink(`uploads/${temp[i]}`,(err)=>{if(err){throw err}else{console.log('deleted')}})
                  }});
               }
               else if(/.webp$/.test(temp[i])){
                  // console.log(temp[i])
                  cloudinary.uploader.upload(`uploads/${temp[i]}`,(err,result)=>{if(err){throw err}
                     else{
                        // console.log(result.secure_url)
                        img_url.push(result.secure_url)
                        fs.unlink(`uploads/${temp[i]}`,(err)=>{if(err){throw err}else{console.log('deleted')}})
                  }});
               }

               }
               // console.log('outside')                
            })
            setTimeout(() => {
               console.log(img_url)
               temp1.image_url1=img_url[0]
               temp1.image_url2=img_url[1]
               temp1.image_url3=img_url[2]
               temp1.image_url4=img_url[3]
               let newuser = product({...temp1})
               let data159 = async()=>{
               let val159=await newuser.save()
               await console.log(val159)
               res.json(val159)
            }
            data159();
         }, 10000);  
                     
            // res.send(newuser)
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