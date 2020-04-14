const app = require("./app")
const dotenv = require("dotenv")
dotenv.config()




app.get('/',(req,res)=>{
    res.send('hello world')
})





let Port = process.env.PORT || 5555
app.listen(Port, () => {
    console.log(`Server listening at ${Port}`)
})