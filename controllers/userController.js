const users = require('../models/usermodel')
module.exports = {
   get: {
      async register_user(req, res) {
         res.send('ok')
      },
      async login_user(req, res) {
         res.send('ok')
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
      }
   }
}

