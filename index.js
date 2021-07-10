const express = require('express')
const app = express()
const port = 5000

/* mongo DB URI를 가져오기 */
const config = require('./config/key');

/* Body에 담겨진 데이터(클라이언트에서 보낸 데이터)를 서버에서 이해하는 언어로
    변환하기 위해서는 Bodyparser를 이용해야 한다. */
const bodyParser = require('body-parser');

// application/x-www.form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
// application/json
app.use(bodyParser.json());

/* 회원가입에 필요한 유저 정보를 가져오기 위함. */
const { User } = require("./models/User");

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
app.post('/register', (req, res) => {

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


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/* [ 참고 ] express js 공식 문서 : https://expressjs.com/ko/starter/hello-world.html */