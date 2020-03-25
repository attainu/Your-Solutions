const {get,post,put,delete1} =require("../controllers/userController")
// const controller=require("../controllers/userController")
const{Router}=require("express")
const router=Router()


//-------------------------------------------------------Get Request Route
router.get("/user/verify/:token",get.verify_user_email)


//-------------------------------------------------------Post Request Route
router.post("/user/register",post.register_user)
router.post("/user/login",post.login_user)
router.post("/user/forgot_password",post.forgot_password)

//-------------------------------------------------------Put Request Route
router.put("/user/forgot_password/:id",put.forgot_password)
//-------------------------------------------------------Delete Request Route
router.delete("/user/logout/:userToken",delete1.logout_user)




module.exports=router