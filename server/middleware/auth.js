const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증처리

  //클라이언트 쿠키에서 토큰 가져온다
  let token = req.cookies.x_auth;

  //토큰을 복호화한후 유저 찾기
  User.findbyToken(token, (err, user) => {
    if(err) throw err;
    if(!user) return res.json({ isAuth: false, error: true })

    req.token = token;
    req.user = user;
    next();
  })

  //유저가 있으면 인증 O 없으면 인증 X
}

module.exports = { auth };