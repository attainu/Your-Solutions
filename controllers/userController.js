const users = require('../models/usermodel')
const email1= require('./emailcontroller')
module.exports = {
   get:{
      async register_user(req, res) {
         res.send('ok')
      },
      async login_user(req, res) {
         res.send('ok')
      },
      async verify_user_email(req,res){
         try{
            let temp = req.params.token
            let user1 = await users.find_user_by_token(temp)
            await res.json(user1)
         }
         catch(err){
            console.log(err.message)
            res.status(500).send("server error")
         }
      }
   },
   post: {
      //--------------------------------------------------------login user logic
      async login_user(req, res) {
         try {
            const { email, password } = req.body
            if (!email || !password)
               return res.status(400).send("Incorrect Credentials")
            const user = await users.find_by_email_and_password(email, password)
            const accesToken = await user.generateToken()
            res.status(201).json({
               statusCode: 201,
               token: accesToken
            })
         }
         catch (err) {
            console.log(err.message)
            if(err.message=="Invalid Credentials")  return res.status(400).send("Invalid Credentials")
            return res.send("ServerError")
         }
      },
      //--------------------------------------------------------register user logic
      async register_user(req, res) {
         try {
            let user = req.body
            const { email, password, name } = user
            if (!email || !password || !name)
               return res.status(400).send("ValidationError")
            const NewUser = await users.create(user)
            NewUser.resetToken=null
            token = await NewUser.generateToken()
            let subject=`Welcome to ShubhKadam.com` 
            let html=`<h2>Thanks for Joining Us</h2>
                        <h3>Dear ${name} you are one step closer to become one of our prestigious family</h3>
                        <p>To verify your email Click <a href=http://localhost:5555/user/verify/${token} >here</a></p> or 
                        <p>click this link to your browser:- http://localhost:5555/user/verify/${token} </p>
                        <p>Thank you!!!!</p>`;

            email1(email,subject,html)          //function to send email to the user
            
            res.status(201).json({
               statusCode: 201,
               NewUser
            })
         }
         catch (err) {
            console.log(err.message)
            if (err.name === "MongoError")
               return res.status(400).send(`Email already occupied`);
            if (err.name === "ValidationError")
               return res.status(400).send(`Validation Error: ${err.message}`);
            return res.status(500).send("Server Error");
         }
      },
      //----------------------------------------------------------------------------end
      //----------------------------------------------------------------------user forgot password logic
      async forgot_password(req,res){
         try {
            let {email} = req.body
            const user = await users.find_by_email(email)
            const resetToken = await users.generate_reset_token(user)
            let subject=`Password Reset` 
            let html=`<h2>ShubhKadam.com</h2>
                        <h3>Dear ${user[0].name}, Seems like you forgot your password for ShubhKadam.com account. if this is true, click below to reset your password.</h3>
                        <button style="background-color: #338DFF; /* blue */
                        border: none;
                        color: white;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        cursor: pointer;"><a href=http://localhost:5555/user/forgot_password/${resetToken}">Reset My Password</a></button> 
                        <p>copy paste this link to your browser:- http://localhost:5555/user/forgot_password/${resetToken}
                        <p style="color:red;">If you did not forgot your password you can safely ignore this email.</p>
                        <p>Thank you for choosing ShubhKadam.com</p>`;
            email1(user[0].email,subject,html)
            res.status(200).json({statuscode: 200, message:`We have send a reset password email to ${user[0].email}. Please click the reset password link to set a new password.`})            
            
         } catch (err) {
            console.log(err.message)
            res.status(500).send("server error")
         }
      },
      //----------------------------------------------------------------------------end
   },
   //----------------------------------------------------------------------------start of put request
   put:{ 
   async forgot_password(req,res){
      console.log(req.params)
      res.send('ok')
   }


   },
   //-------------------------------------------------------------------------------end of put request
   //-------------------------------------------------------------------------------start of delete request
   delete1:{
      //------------------------------------------------------------------------user logout logic
      async logout_user(req,res){
         try{
            token=req.params.userToken
            const user = await users.nullifyToken(token)
            res.json(user)
         }
         catch(err){
            console.log(err.message)
            res.status(500).send("server error")
         }
      },
      //----------------------------------------------------------------------------end
   }
}

