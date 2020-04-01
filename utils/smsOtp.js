const authy = require("authy")(process.env.authy_api_key)
// to register user---------------
let send_otp_through_phone = async (email, phoneNo) => {

    try {
      let status=  await authy.register_user(email, phoneNo, "+91", (err, res) => {
            if (err) throw new Error("phone No validation failed")
            let id = res.user.id
            // console.log(id)
            // let force = true
            //  authy.request_sms(id, force, (err, res, ) => {
            //     if (err) throw new Error("otp not send")
            //     console.log(res);
              return id
        })
        console.log(status)
        
        // })
    }
    catch (err) {
        console.log(err.message)
    }
}

module.exports = send_otp_through_phone
// // send sms with otp-------------------
// let force = true
// authy.request_sms(send_otp_through_phone(email, phone), force, (err, res, ) => {
//     if (err) {
//         console.log(err)
//     }
//     console.log(res);
// });



