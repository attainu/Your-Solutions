const reviews = require("../models/review")
const users = require("../models/usermodel")
const products = require("../models/product")

module.exports = {
   get1: {
      async products_view(req, res) {
         const { gender } = req.params
         try {
            const all_products = await products.find({ gender: gender })
            
            await res.json(all_products)
         }
         catch (err) {
            console.log(err)
         }
      },
      async product_details(req, res) {
         const { productId } = req.params
         try {
            const product =await products.find({ _id: productId })
            // const user_review = await reviews.find({product_id:productId})
            // await console.log(user_review)
            // const{name,review}=user_review
            // product.review={name:name,review:review}
            // await product.save()
            // console.log(product)
            await res.json(product)
         }
         catch (err) {
            console.log(err)
         }
      }

   },
   post1: {
      async post_reviews(req, res) {
         try {
           const {review} = req.body
            const { productId } = req.params
            const userToken = req.header('Authorization');

            const user = await users.find_user_by_token(userToken)
            newReview = await reviews.create({
               userId:user._id,
               name: user.name,
               review: review,
               product_id: productId
            })
            // const product=await products.findOne({_id:productId})
            // product.review=newReview
            // product.save()
            newReview.save()
            console.log(newReview)
            res.json(newReview)
         }
         catch (err) {
            console.log(err.message)
            res.send("server error")
         }
      }
   }
}