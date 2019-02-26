const UserModel = require('./models/users.model')
//const _ = require('lodash')
const passport = require('passport')
const { Strategy: StrategyVK } = require('passport-vkontakte')

passport.use(
  new StrategyVK(
    {
      clientID: 6865856,
      clientSecret: 'oMRCfB9ILR08Nf5PHCyJ',
      callbackURL: 'http://localhost:3000/auth/vkontakte/callback',
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
          console.log('saving user error')
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

      console.log('user')
      console.log(user)

      done(null, user)
    }
  )
)

const authorizevk = passport.authenticate('vkontakte', {})

const vkCheckAuth = passport.authenticate('vkontakte', { session: true })

const vkAuthCallback = passport.authenticate('vkontakte', {
  session: true,
  successRedirect: '/',
  failureRedirect: '/login',
})

module.exports = {
  authorizevk,
  vkAuthCallback,
  vkCheckAuth,
}
