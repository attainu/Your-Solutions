const { get, post, put, delete1} = require("../controllers/adminController")
const { Router } = require("express")
const multer=require('multer')
const upload = require('../utils/multer')

const router = Router()
router.post("/admin/login",post.login_admin)
router.post("/admin/addproducts",upload.single("product_img"),post.add_product)
// router.patch("/admin/editProducts/:productId",patch.edit_product)
// router.delete("/admin/deleteProduct/:productId",patch.delete_product)
router.delete("/admin/logout/:adminToken",delete1.logout_admin)
module.exports=router