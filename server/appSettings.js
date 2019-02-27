const config = require('./config/server')
const socket = require('./sockets/config/namespaces')
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const sharedsession = require('express-socket.io-session')
const redisClient = require('redis').createClient({
  host: config.redisHost,
  port: config.redisPort,
})

module.exports = (app, io) => {
  const sess = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: null,
    },
    store: new RedisStore({ client: redisClient }),
  })

  app.use(sess)

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded())
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function(user, done) {
    done(null, user)
  })

  passport.deserializeUser(function(user, done) {
    done(null, user)
  })

  socket.namespaces.forEach(n =>
    io.of(n).use(sharedsession(sess, { autoSave: true }))
  )
}
