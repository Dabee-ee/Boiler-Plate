const express = require('express')
const app = express()
const port = 5000

/* authentication 가져오기 */
const { auth } = require('./server/middleware/auth');

/* 토큰 생성 후 저장을 위한 cookieParser */
const cookieParser = require('cookie-parser');
app.use(cookieParser());

/* mongo DB URI를 가져오기 */
const config = require('./server/config/key');

/* Body에 담겨진 데이터(클라이언트에서 보낸 데이터)를 서버에서 이해하는 언어로
    변환하기 위해서는 Bodyparser를 이용해야 한다. */
const bodyParser = require('body-parser');

// application/x-www.form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
// application/json
app.use(bodyParser.json());


/* 회원가입에 필요한 유저 정보를 가져오기 위함. */
const { User } = require("./server/models/User");

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false 
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))
/* Connection String Only 부분을 ''안에 넣어주면 됨!*/ 



/*-------------------------------------------------------------*/



/* 간단한 route를 만들어 보자. */
app.get('/', (req, res) => {
  res.send('Hello World!')
})

/* 회원 가입을 위한 route를 만들어 보자. */
app.post('/api/users/register', (req, res) => {

  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  // 가져온 User 모델을 이용해서 인스턴스를 만든다.
  const user = new User(req.body) // req.body로 클라이언트에서 보낸 정보를 받아준다.

  user.save((err, userInfo) => {
    if(err) return res.json({ success : false, err})
    return res.status(200).json({
      success : true
    })
  })

})

/* 로그인을 위한 route */
app.post("/api/users/login", (req, res)=> {


  // 1. 요청된 이메일이 데이터베이스에 있는지 찾는다.
  User.findOne({ email : req.body.email }, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess : false,
        message : "제공된 이메일에 해당하는 유저가 없습니다. ",
      });
    }

  // 2. 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
  user.comparePassword(req.body.password, (err, isMatch) =>{
    if(!isMatch)
      return res.json({ loginSuccess : false, message : "비밀번호가 틀렸습니다." });


  // 3. 비밀번호까지 맞다면 token 생성
  user.generateToken((err, user)=> {
    if(err) return res.status(400).send(err);

    // 받아온 token을 어딘가에 저장해서 클라이언트로 보내야 한다.
    // 저장할 수 있는 곳은 쿠키, 로컬 스토리지

    // 쿠키에 저장해보자. 쿠키에 저장하려면 쿠키 파서를 다운로드 받아야 한다.
    res
    .cookie("x_auth", user.token)
    .status(200)
    .json({ loginSuccess : true, userId: user._id});

  }) // 3 end
}) // 2 end
}) // 1 end
})

/* Auth를 위한 route */

app.get('/api/users/auth', auth, (req, res) => {

  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
  // 통과했다는 것을 client로 전달해주어야 한다.

  res.status(200).json({
    _id : req.user._id,
    isAdmin : req.user.role === 0 ? false : true, // role이 0 -> 일반 유저, role이 0이 아니면 관리자
    isAuth : true,
    email :req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image : req.user.image
    })

})


// 로그아웃 시도를 한다는 것은 로그인 되어 있는 상태이므로, auth 정보를 가지고 있다. 
// 따라서 인자로 auth를 넣어 사용한다.
app.get('/api/users/logout', auth, (req, res) => {

  User.findOneAndUpdate({ _id : req.user._id },
  { token : "" }
  , ( err, user ) => {
  if (err) return res.json({ success : false, err });
  return res.status(200).send({
  success : true
  })
  })
  
  })


  /* Hello Router */
  app.get('/api/hello', (req, res) => {
    res.send("안녕하세요~")
  })


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/* [ 참고 ] express js 공식 문서 : https://expressjs.com/ko/starter/hello-world.html */