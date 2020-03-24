const app = require("./app")
const dotenv=require("dotenv")
dotenv.config()
app.listen(5555,function(){
    console.log("server started")
})