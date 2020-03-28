const { get1, post1, put1, delete1 } = require("../controllers/productController")
const { Router } = require("express")
const router = Router()
router.post("/review/:productId",post1.post_reviews)
router.get("/shoes/product/:productId",get1.product_details)
router.get("/shoes/:gender",get1.products_view)
module.exports=router