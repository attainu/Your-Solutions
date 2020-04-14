const randomstring = require("randomstring")
const reviews = require("../models/review")
const users = require("../models/usermodel")
const products = require("../models/product")
const payment1 = require("../models/payment")
const carts = require("../models/cart")
const Razorpay = require('razorpay')
let val = undefined
let { RAZOR_PAY_KEY_ID, RAZOR_PAY_SECRET } = process.env
let instance = new Razorpay({
   key_id: RAZOR_PAY_KEY_ID,
   key_secret: RAZOR_PAY_SECRET
})

module.exports = {
   get1: {
      // ------------------to view products---------------
      async products_view(req, res) {
         const { gender } = req.params
         const {page}=req.query
         const perPage = 2
         let current_page = Math.max(0, page)
         try {
            const all_products = await products.find({ gender: gender }).skip(perPage*current_page).limit(perPage)
            await res.json(all_products)
         }
         catch (err) {
            console.log(err)
         }
      },
      // --------------------------to view the product detail and its review-----------------
      async product_details(req, res) {
         const { productId } = req.params
         let reviewArray = []
         try {
            const product = await products.find({ _id: productId })
            const user_review = await reviews.find({ product_id: productId })
            for (let i = 0; i < user_review.length; i++) {
               const productReviewObj = {
                  name: user_review[i].name,
                  review: user_review[i].review,
                  star: user_review[i].star
               }
               reviewArray.push(productReviewObj)
            }
            res.json({ product: product, review: reviewArray })
         }
         catch (err) {
            console.log(err)
         }
      },
      //--------------to view the cart page--------------
      async cartPage(req, res) {
         const { userId } = req.params
         const userCart = await carts.find({ user_id: userId })

         let totalPrice = 0
         let cartArray = []
         for (i = 0; i < userCart.length; i++) {
            const productDetail = await products.find({ _id: userCart[i].product.product_id })
            totalPrice = (userCart[i].product.price) + totalPrice
            newobj = {
               num: i + 1,
               image: productDetail[0].image_url1,
               name: productDetail[0].name,
               size: userCart[i].product.size,
               quantity: userCart[i].product.quantity,
               price: userCart[i].product.price,
            }
            cartArray.push(newobj)
         }
         await res.json({ products: cartArray, totalPrice: totalPrice })
      },
      // ----------------to sort the product------------------
      async sort_the_product(req, res) {
         try {
            const { gender } = req.params
            const { value, size } = req.body
            if (value == "ascending_date") {
               const all_products = await products.find({ gender: gender }).sort({ createdAt: 1 })
               res.send(all_products)
            }
            else if (value == "descending_date") {
               const all_products = await products.find({ gender: gender }).sort({ createdAt: -1 })
               res.send(all_products)
            }
            else if (value == "high_price") {
               const all_products = await products.find({ gender: gender }).sort({ "details.price": -1 })
               res.send(all_products)
            }
            else if (value == "low_price") {
               const all_products = await products.find({ gender: gender }).sort({ "details.price": 1 })
               res.send(all_products)
            }
            else if (size) {
               const all_products = await products.find({ "details.size": size })
               if (all_products.length == 0) return res.send(`product of size ${size} is not available right now..come again later `)
               res.send(all_products)
            }
         }
         catch (err) {
            console.log(err.message)
            res.send("serverError")
         }
      },
   },
   post1: {
      async post_reviews(req, res) {
         try {
            const { review, star } = req.body
            const { productId } = req.params
            const user = req.user
            newReview = await reviews.create({
               userId: user._id,
               name: user.name,
               review: review,
               star: star,
               product_id: productId
            })
            newReview.save()
            res.status(201).json({ statusCode: 200, newReview })
         }
         catch (err) {
            console.log(err.message)
            res.send("server error")
         }
      },
      async add_to_cart(req, res) {
         try {
            const { size, color, quantity } = req.body
            const user = req.user
            const { productId } = req.params
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


      },
      async generate_order(req, res) {
         try {
            let user = req.user
            let temp = req.body
            let options = {
               amount: temp.amount,  // amount in the smallest currency unit
               currency: "INR",
               receipt: randomstring.generate(7),
               payment_capture: 1
            };
            instance.orders.create(options, (err, order) => {
               if (err) throw err
               // console.log(order);
               val = order;
            }).then(() => {
               let paymentobj = {
                  user_id: user._id,
                  order_id: val.id,
                  razor_payment_id:null,
                  razor_signature:null
               }
               let yahoo = async ()=>{
                  let order = await payment1.create(paymentobj)
                  order.save()
                  res.send(val)
               }
               yahoo()
            })
         } catch (err) {
            console.log(err)
         }
      },
      async razor_pay_success(req, res) {
         console.log(req.body)
         const {razorpay_payment_id,razorpay_order_id,razorpay_signature}=req.body
         await payment1.findOneAndUpdate({order_id:razorpay_order_id}, {$set:{razor_payment_id:razorpay_payment_id,razor_signature:razorpay_signature}},{new:true})
      }
   }
}