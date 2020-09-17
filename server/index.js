//서버 시작점
const express = require('express') 
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookirParser = require('cookie-parser')
const { User } = require("./models/User")
const { auth } = require("./middleware/auth")
const mongoode = require('mongoose')
const config = require('./config/key')


app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cookirParser());

//DB 연결
mongoode.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
.then (() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요 끼루룩')
})

app.get('/api/hello', (req, res) => res.send('Hello World!!'))

//화원가입의 필요한 정보를 client에서 가져와 DB에 저장
app.post('/api/register', (req, res) => {

    const user = new User(req.body)
    //mongoDB 메소드 save
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({ success: true })
    })

})

//로그인
app.post('/api/login', (req, res) => {
  //요청된 이메일 DB에 있는지 찾기
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다."
      });
    }
    //이메일 확인 후 있다면 비밀번호 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
        });
      }
      //비밀번호 확인 후 맞다면 토큰생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰저장
        res.cookie("x_auth", user.token)
          .status(200)
          .json({
            loginSuccess: true,
            userId: user._id
          });
      })
    })
  })
})

app.get('/api/users/auth', auth , (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth , (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, {token: ""}, (err,user) => {
    if(err) return res.json({ success:false,err });
    return res.status(200).send({ success:true })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

