/* 몽고DB 연결 */
const mongoose = require('mongoose');

/* 비밀번호 암호화 bcrypt */
const bcrypt = require('bcrypt');
/* Salt를 먼저 생성 -> Salt를 이용해서 비밀번호를 암호화 해야함 */
/* Salt가 몇 글자인지 설정 */
const saltRounds = 10;

/* token 생성을 위한 jsonwebtoken 라이브러리 */
const jwt = require('jsonwebtoken');

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
        maxlength : 500
    },
    role : {
        type : Number,
        default : 0
    },
    image : String, /* Object로 안 주고 타입만 줄 수도 있다. */
    token : {
        type : String,
        maxlength : 500
    },
    tokenExp : {
        type : Number
    }
    
})


/* 비밀번호 암호화 */
userSchema.pre('save', function ( next ){

    var user = this; 

    // 주의!! 이메일, 이름 등 다른 정보 수정 시에 비밀번호가 암호화 되면 안된다.
    // 그러므로 회원가입, 비밀번호 수정 시에만 비밀번호가 암호화 되도록 조건을 걸어줘야 한다.
    if(user.isModified('password')){

    // 비밀번호를 암호화 시킨다.


    // 1. genSalt : salt 생성, 이 때 saltRounds를 사용해서 salt 글자 수 ㅣㅈ정
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err)

        // 2. plain password : 원래의 비밀번호를 가져와 암호화
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err) 

            // 암호화에 성공했다면 hash된 비밀번호로 변경
            user.password = hash
            next() // 다음 코드를 실행시켜라. --> 여기서 다음 코드는 회원 가입 진행.
        })
    })
} else {
    next()
}
})

/* password 비교 */
userSchema.methods.comparePassword = function (plainPassword, cb) {

    // plainPassword : 1234567 암호화된 비밀번호 
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
            cb(null, isMatch)
    })
} // 결과 값이 index.js의 login route로 전해진다.


/* token 생성 */
userSchema.methods.generateToken = function(cb){

    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기

    var token = jwt.sign(user._id.toHexString(),'secretToken');

    // 만든 토큰을 token 필드에 넣어줘야 한다.
    user.token = token;
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
} // 생성된 token을 index.js로 보낸다.

/* Auth 기능 생성 */
userSchema.statics.findByToken = function ( token, cb) {

    var user = this ;

    // 토큰을 decode 한다. (json web token 이용)
    jwt.verify(token, 'secretToken', function (err, decoded) {

        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id" : decided, "token" : token }, function (err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }