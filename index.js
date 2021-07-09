const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dababy:dababy@cluster0.ux1qy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false 
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))
/* Connection String Only 부분을 ''안에 넣어주면 됨!*/ 


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/* [ 참고 ] express js 공식 문서 : https://expressjs.com/ko/starter/hello-world.html */