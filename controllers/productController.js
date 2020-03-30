const reviews = require("../models/review")
const users = require("../models/usermodel")
const products = require("../models/product")
const carts = require("../models/cart")

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
            const product = await products.find({ _id: productId })
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
      },
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
         // console.log(totalPrice)
         await res.json({products:cartArray,totalPrice:totalPrice})
      }


   },
   post1: {
      async post_reviews(req, res) {
         try {
            const { review } = req.body
            const { productId } = req.params
            const userToken = req.header('Authorization');

            const user = await users.find_user_by_token(userToken)
            newReview = await reviews.create({
               userId: user._id,
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
      },
      async add_to_cart(req, res) {
         try {
            const { size, color, quantity } = req.body
            const userToken = req.header("Authorization")
            const { productId } = req.params
            const user = await users.find_user_by_token(userToken)
            const product = await products.find({ _id: productId })
            let t = 0
            for (i = 0; i < product[0].details.length; i++) {
               if (product[0].details[i].size == size) {
                  let u = 0
                  let v = 0
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
                           v = v + 1
                           continue
                        }
                     }
                     else {
                        u = u + 1
                     }
                  }

                  if (v > 0) return res.send(`out of stock`)
                  if (u > product[0].details[i].colors.length - 1) return res.send(` ${color} color is not available right now, it will come soon`)

               }
               else {
                  t = t + 1
                  continue
               }
            }
            if (t > product[0].details.length - 1) return res.send(`size ${size} is not available right now, it will come soon `)
         }
         catch (err) {
            console.log(err)
         }


      }
   }
}