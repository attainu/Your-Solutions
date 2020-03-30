const reviews = require("../models/review")
const users = require("../models/usermodel")
const products = require("../models/product")
const carts = require("../models/cart")

module.exports = {
   get1: {
      // ------------------to view products---------------
      async products_view(req, res) {
         const { gender } = req.params
         try {
            const all_products = await products.find({ gender: gender })
            const user_review = await reviews.find({product_id:productId})
            for (let i=0;i<user_review.length;i++){
            review=user_review[i].review
            reviewArray.push(review)
            }
            await res.json(all_products)
         }
         catch (err) {
            console.log(err)
         }
      },
// --------------------------to view the product detail and its review-----------------
      async product_details(req, res) {
         const { productId } = req.params
         let reviewArray=[]
         try {
            const product = await products.find({ _id: productId })
            const user_review = await reviews.find({product_id:productId})
            for (let i=0;i<user_review.length;i++){
            const productReviewObj={review:user_review[i].review,
            star:user_review[i].star
            }
            reviewArray.push(productReviewObj)
            }
            res.json({product:product,review:reviewArray})
         }
         catch (err) {
            console.log(err)
         }
      },
      //--------------to view the cart page--------------
      async cartPage(req, res) {
         const { userId } = req.params
         const userCart = await carts.find({ user_id: userId })
         let totalPrice=0
         let cartArray=[]
         for (i = 0; i < userCart.length; i++) {
            const productDetail = await products.find({ _id: userCart[i].product.product_id })
            totalPrice=(userCart[i].product.price)+totalPrice
            newobj = {
               num: i+1,
               image:productDetail[0].image_url1,
               name:productDetail[0].name,
               size:userCart[i].product.size,
               quantity:userCart[i].product.quantity,
               price:userCart[i].product.price,
            }
            cartArray.push(newobj)
         }
         await res.json({products:cartArray,totalPrice:totalPrice})
      }


   },
   post1: {
      async post_reviews(req, res) {
         try {
            const { review,star } = req.body
            const { productId } = req.params
            const userToken = req.header('Authorization');
            console.log(star)
            const user = await users.find_user_by_token(userToken)
            newReview = await reviews.create({
               userId: user._id,
               name: user.name,
               review: review,
               star:star,
               product_id: productId
            })
            newReview.save()
            console.log(newReview)
            res.json(newReview)
         }
         catch (err) {
            console.log(err.message)
            res.send("server error")
         }
      },
      async add_to_cart(req, res) {
         try {
            const { size, color, quantity } = req.body
            const userToken = req.header("Authorization") //token validation is not done yet user must be validated first
            const { productId } = req.params
            const user = await users.find_user_by_token(userToken)
            const product = await products.find({ _id: productId })
            let count3 = 0
            for (i = 0; i < product[0].details.length; i++) {
               if (product[0].details[i].size == size) {
                  let count1 = 0
                  let count2 = 0
                  for (j = 0; j < product[0].details[i].colors.length; j++) {
                     if (product[0].details[i].colors[j].color == color) {
                        if ((product[0].details[i].colors[j].quantity) >= quantity) {
                           const price = (product[0].details[i].price) * quantity
                           const cart = {
                              user_id: user._id,
                              product: { product_id: productId, size: size, color: color, quantity: quantity, price: price }
                           }
                           cart1 = await carts.create(cart)
                           await cart1.save()
                           return res.json(cart1)
                        }
                        else {
                           console.log(quantity, product[0].details[i].colors[j].quantity)
                           count2 = count2 + 1
                           continue
                        }
                     }
                     else {
                        count1 = count1 + 1
                     }
                  }

                  if (count2 > 0) return res.send(`out of stock`)
                  if (count1 > product[0].details[i].colors.length - 1) return res.send(` ${color} color is not available right now, it will come soon`)

               }
               else {
                  count3 = count3 + 1
                  continue
               }
            }
            if (count3 > product[0].details.length - 1) return res.send(`size ${size} is not available right now, it will come soon `)
         }
         catch (err) {
            console.log(err)
         }


      }
   }
}