//서버 시작점
const express = require('express') 
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User } = require("./models/User")
const mongoode = require('mongoose')
const config = require('./config/key')


app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

//DB 연결
mongoode.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
.then (() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요 끼루룩')
})

//화원가입의 필요한 정보를 client에서 가져와 DB에 저장
app.post('/register', (req, res) => {

    const user = new User(req.body)

    //mongoDB 메소드 save
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({ success: true })
    })

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

