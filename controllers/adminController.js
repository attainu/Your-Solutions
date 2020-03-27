const admins =require("../models/admin")
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
            console.log(req.body)
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