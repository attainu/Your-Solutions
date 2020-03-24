const {registerUser , loginUser} =require("../controllers/userController")
const{Router}=require("express")
const router=Router()
router.post("user/register",registerUser)
router.post("user/login",loginUser)





module.exports=router