const UserModel = require('./models/users.model')
const passport = require('passport')
const { Strategy: StrategyVK } = require('passport-vkontakte')
const authConfig = require('./config/auth')
const serverConfig = require('./config/server')
const { getErrorResponse } = require('./helpers/respoonseHelpers')

passport.use(
  new StrategyVK(
    {
      clientID: authConfig.clientID,
      clientSecret: authConfig.clientSecret,
      callbackURL: `http://${serverConfig.host}:${
        serverConfig.port
      }/auth/vkontakte/callback`,
    },
    async (accessToken, refreshToken, params, profile, done) => {
      let user = await UserModel.findOne({
        vkId: profile.id,
      })
        .select('-vkId -addedAt')
        .lean()
        .exec()
        .catch(err => {
          console.log('search error')
          console.log(err)
        })

      if (!user) {
        user = new UserModel({
          name: profile.name.givenName,
          vkId: profile.id,
          url: profile.profileUrl,
          photo: profile._json.photo || '',
        })

        user = await user.save().catch(err => {
          console.log(err)
        })

        user = {
          id: user._id,
          url: user.url,
          photo: user.photo,
          name: user.name,
        }
      } else {
        user.id = user._id
        delete user._id
      }

      done(null, user)
    }
  )
)

const authorizevk = passport.authenticate('vkontakte', {})

const vkAuthCallback = passport.authenticate('vkontakte', {
  session: true,
  successRedirect: '/',
  failureRedirect: '/login',
})

const checkAuth = (req, resp, next) => {
  const { user } = req
  if (user && user.id) {
    next()
  } else {
    resp.status(401).json(getErrorResponse('Требуется авторизация'))
  }
}

module.exports = {
  authorizevk,
  vkAuthCallback,
  checkAuth,
}
