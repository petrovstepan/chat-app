const {
  checkChatExists,
  userExists,
  userHasRightsForChat,
} = require('./middlewares')
const { vkAuthCallback, authorizevk, checkAuth } = require('../auth')
const { getSuccessResponse } = require('../helpers/respoonseHelpers')
const ChatModel = require('../models/chats.model')
const MessageModel = require('../models/messages.model')
const express = require('express')
const path = require('path')

module.exports = app => {
  app.get('/api/user/chats', checkAuth, async (req, resp) => {
    const chats = await ChatModel.find({
      users: {
        $in: [req.user.id], // ошибка после переавторизации
      },
    })
      .populate([
        {
          path: 'users',
          match: { _id: { $nin: [req.user.id] } },
        },
        'lastMessage',
      ])
      .lean()
      .exec()
      .catch(err => console.log('error chats'))

    if (chats) {
      resp.json({ status: 'OK', data: { chats } })
    } else {
      resp.json({
        status: 'FAIL',
        data: { error: 'Ошибка при загрузку чатов' },
      })
    }
  })

  app.get(
    '/api/user/chats/:id/messages',
    [checkAuth, checkChatExists, userHasRightsForChat, userExists],
    async (req, resp) => {
      let { chat } = req
      let messages = []

      if (chat) {
        messages = await MessageModel.find({ chatId: chat._id })
          .lean()
          .exec()
          .catch(err => console.log('catched err'))
      }

      // либо есть чат и сообщения, либо чата нет, но есть пользователь, с которым можно начать чат и сообщений пока нет
      resp.json(getSuccessResponse({ messages }))
    }
  )

  app.get('/auth/vk', authorizevk)
  app.get('/auth/vkontakte/callback', vkAuthCallback, (req, res) => {})
  app.use('/static', express.static(path.join(__dirname, '..', '..', 'dist')))
  app.use('/assets', express.static(path.join(__dirname, '..', '..', 'public')))

  app.get('/*', (req, resp) => {
    const { user } = req
    const production = app.get('env') === 'PRODUCTION'
    const src = production ? 'public' : 'dist'

    // отправляем куки при первичной загрузке страницы, для инициализации state
    if (user) {
      for (let key of Object.keys(user)) {
        resp.cookie([key], user[key], {
          expires: new Date(Date.now() + 60 * 1000),
        })
      }
    }

    resp.sendFile(path.join(__dirname, '..', '..', src, 'index.html'))
  })

  app.post('/api/logout', (req, resp) => {
    if (req.user) {
      Object.keys(req.user).map(k => resp.clearCookie(k))
    }
    resp.clearCookie('connect.sid')
    req.session.destroy(err => resp.json({ status: 'OK', data: {} }))
  })
}
