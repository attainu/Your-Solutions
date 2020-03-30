const express = require("express")
const app = express()
const dotenv = require("dotenv")
const morgan = require('morgan')
const userRoute = require('./Routes/userRoutes')
const adminRoute = require('./Routes/adminRoutes')
const productRoute = require('./Routes/productRoutes')
const cors=require('cors')
app.use(express.urlencoded({extended:true}))

app.use(
    cors({
        origin:"*",                     //"http://127.0.0.1:5500/addproduct.html",
        allowedHeaders: ["Content-Type"],
        credentials: true
    })
);




dotenv.config()
require("./db")
app.use(morgan('dev'))
app.use(express.json())
app.use(userRoute)
app.use(adminRoute)
app.use(productRoute)
module.exports = app