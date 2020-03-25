const {get,post} =require("../controllers/userController")
// const controller=require("../controllers/userController")
const{Router}=require("express")
const router=Router()
// router.post("user/register",get.)
router.post("/user/register",post.register_user)
router.post("/user/login",post.login_user)
router.delete("/user/logout/:userToken",post.logout_user)




module.exports=router