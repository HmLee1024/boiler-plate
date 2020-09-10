//서버 시작점
const express = require('express') 
const app = express()
const port = 5000
const mongoode = require('mongoose')

mongoode.connect("mongodb+srv://hyemin:multi1004@bolier-plate.f2gxy.mongodb.net/boiler-plate?retryWrites=true&w=majority", {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
.then (() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

