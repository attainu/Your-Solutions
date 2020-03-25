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
            const user = await users.findByEmailAndPassword(email, password)
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
            token = await NewUser.generateToken()
            let subject=`Welcome to shubkadam.com` 
            let text=`<h2>Thanks for Joining Us</h2>
                        <h3>Dear ${name} you are one step closer to become one of our prestigious family</h3>
                        <p>To verify your email Click <a href = "localhost:5555/user/verify/${token}">here</a></p> or 
                        <p>copy paste this link to your browser:- <a href:"localhost:5555/user/verify/${token}">localhost:5555/user/verify/${token}</a>
                        <p>Thank you!!!!</p>`;

            email1(email,subject,text)          //function to send email to the user
            
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
            console.log(email)
            let val1 = await users.find_by_email(email)
            let subject=`Password Reset` 
            let text=`<h2>shubkadam.com</h2>
                        <h3>Dear ${val1[0].name}, Seems like you forgot your password for shubkadam.com account. if this is true, click below to reset your password.</h3>
                        <button style="background-color: #338DFF; /* blue */
                        border: none;
                        color: white;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        cursor: pointer;" onclick="document.location.href='localhost:5555/user/forgot_password/${val1[0]._id}'">Reset My Password</button> 
                        <p>copy paste this link to your browser:- <a href="localhost:5555/user/forgot_password/${val1[0]._id}">localhost:5555/user/forgot_password/${val1[0]._id}</a>
                        <p style="color:red;">If you did not forgot your password you can safely ignore this email.</p>
                        <p>Thank you for choosing shubkadam.com</p>`;
            email1(val1[0].email,subject,text)
            res.status(200).json({statuscode: 200, message:`We have send a reset password email to ${val1[0].email}. Please click the reset password link to set a new password.`})            
            
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

