const mongoose = require("mongoose")
const {MONGODB_PASS,MONGODB_URL} = process.env
mongoose.connect(MONGODB_URL.replace("<password>",MONGODB_PASS),{
    useCreateIndex:true,
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(function(){
    console.log("Database Connected Successfully")
}).catch(function(err){
    console.log(err.message)
})
