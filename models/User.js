const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    password : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String, /* Object로 안 주고 타입만 줄 수도 있다. */
    token : {
        type : String,
        maxlength : 50
    },
    tokenExp : {
        type : Number
    }
    
})


const User = mongoose.model('User', userSchema)

module.exports = { User }