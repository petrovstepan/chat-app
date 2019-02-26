const passport = require('passport')
const bodyParser = require('body-parser')
//const cookieParser = require('cookie-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const sharedsession = require('express-socket.io-session')
const redisClient = require('redis').createClient({
  host: 'localhost',
  port: 6379,
})

module.exports = (app, io) => {
  const sess = session({
    secret: 'ggYcvSXgKWzQrQfS',
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
  //app.use(cookieParser())
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function(user, done) {
    done(null, user)
  })

  passport.deserializeUser(function(user, done) {
    done(null, user)
  })

  io.of('/online-users').use(
    sharedsession(sess, {
      autoSave: true,
    })
  )
  io.of('/chatlist').use(
    sharedsession(sess, {
      autoSave: true,
    })
  )
  io.of('/chat').use(
    sharedsession(sess, {
      autoSave: true,
    })
  )
}
