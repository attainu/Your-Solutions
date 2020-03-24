const users=require('../models/usermodel')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


module.exports={
   get:{
   async register_user(req,res){
      res.send('ok')        
   },
   async login_user(req,res){
      res.send('ok')
   }
},
post:{
    //--------------------------------------------------------login user logic
   login_user:(req,res)=>{
      let val=req.body
      console.log(val)
      // login user logic code here

      res.send('ok')
   },
   //--------------------------------------------------------register user logic
   register_user:(req,res)=>{
      let temp = req.body
      let hashed=undefined
      bcrypt.hash(temp.password, 10, function(err, hash) {
         // Store hash in your password DB.
         if(err){console.log(err)}
         else{
             hashed=hash;
             console.log(hash)
         }
         let yahoo=async()=>{
            temp.password = await hashed
            // await console.log(temp)
            let token = jwt.sign({
               data: temp.email
             }, 'secret_159', { expiresIn: '1h' });
             let newtemp= {
                name:temp.name,
                email:temp.email,
                password:temp.password,
                token:token
             }
            let newuser = new users({...newtemp})
            try {
               let falling = await newuser.save()
               await console.log(falling)
               res.status(200).send({'token':falling.token})               
            } catch (err) {
               console.log(err.message)
                if (err.name === "ValidationError")
                  return res.status(400).send(`Validation Error: ${err.message}`);
                return res.status(500).send("Server Error");
            }
         }
         yahoo()
     });
   }
}
}
