const app = require("./app")
const dotenv = require("dotenv")
dotenv.config()










let Port = process.env.port || 5555
app.listen(Port, () => {
    console.log(`Server listening at ${Port}`)
})