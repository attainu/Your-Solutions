const mongoose = require("mongoose")
const {MONGODB_PASS,MONGODB_URL} = process.env

let connect = async ()=>{
    try{
        await mongoose.connect(MONGODB_URL.replace("<password>",MONGODB_PASS),{
            useCreateIndex:true,
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
        await console.log("db connected successfully")
    }catch(error){
        await console.log(err.message)
    }
}
connect();


