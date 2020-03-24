const express = require("express")
const app = express()
const dotenv=require("dotenv")
dotenv.config()
require("./db")


module.exports=app