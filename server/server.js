const path = require('path')
require('dotenv').load({ path: path.join(__dirname, '..', '.env') })

const httpConf = require('./config/server')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cookie: true,
  cookieHttpOnly: false,
  // handlePreflightRequest: function (req, res) {
  //   const headers = {
  //     'Access-Control-Allow-Headers': 'Authorization',
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Credentials': true
  //   }
  //   res.writeHead(200, headers)
  //   res.end()
  // }
})

require('./appSettings')(app, io)
require('./db')()
require('./router')(app)
require('./sockets')(io)

if (process.env.PORT) {
  // heroku
  http.listen(process.env.PORT, () => {
    console.log(`server started on heroku on port ${process.env.PORT}`)
  })
} else {
  http.listen(httpConf.port, httpConf.host, () => {
    console.log(`server started on ${httpConf.host} port ${httpConf.port}`)
  })
}
