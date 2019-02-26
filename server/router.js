const { vkAuthCallback, authorizevk } = require('./auth')
const ChatModel = require('./models/chats.model')
const UserModel = require('./models/users.model')
const MessageModel = require('./models/messages.model')
const express = require('express')
const path = require('path')

module.exports = app => {
  const getErrorResponse = (errorText = 'Неизвестная ошибка') => ({
    status: 'FAIL',
    data: {
      error: errorText,
    },
  })

  const getSuccessResponse = (data = {}) => ({
    status: 'OK',
    data: data,
  })

  const checkAuth = (req, resp, next) => {
    const { user } = req
    if (user && user.id) {
      next()
    } else {
      resp.status(401).json(getErrorResponse('Требуется авторизация'))
    }
  }

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

  async function checkChatExists(req, resp, next) {
    const { id } = req.params

    if (!id) {
      resp.status(404).json(getErrorResponse('Не передан параметр чата'))
    }

    const chat = await ChatModel.findOne({
      $or: [
        { _id: id },
        {
          users: {
            $all: [req.user.id, id],
          },
        },
      ],
    })
      .populate('users')
      .lean()
      .exec()
      .catch(err => console.log('error catched checkChatExists'))

    req.chat = chat || null
    next()
  }

  async function userHasRightsForChat(req, resp, next) {
    const { chat } = req
    let userInChat
    if (chat) {
      userInChat = chat.users.find(
        user => user._id.toString() === req.user.id.toString()
      ) // если чат был найден по chatId, а не юзерам
      if (userInChat) {
        next()
      } else {
        // чат существует, но пользователь не имеет к нему отношения
        resp
          .status(401)
          .json(getErrorResponse('У вас нет доступа к этому чату'))
      }
    } else {
      // возможно чата еще ну существует, но существует пользователь, с которым можно начать чат
      // проверим далее
      next()
    }
  }

  async function userExists(req, resp, next) {
    if (req.chat) {
      next() // пропускаем, если чат уже найден
    } else {
      const { id } = req.params

      const user = await UserModel.findOne({ _id: id })
        .lean()
        .exec()
        .catch(err => console.log('catched err'))

      if (user) {
        next()
      } else {
        resp.status(404).json(getErrorResponse('Такого чата не существует'))
      }
    }
  }

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
  app.use('/static', express.static(path.join(__dirname, '..', 'dist')))
  app.use('/assets', express.static(path.join(__dirname, '..', 'public')))

  app.get('/*', (req, resp) => {
    const { user } = req
    // отправляем куки при первичной загрузке страницы, для инициализации state
    if (user) {
      for (let key of Object.keys(user)) {
        resp.cookie([key], user[key], {
          expires: new Date(Date.now() + 60 * 1000),
        })
      }
    }

    resp.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
  })

  app.post('/api/logout', (req, resp) => {
    req.session.destroy(err => resp.json({ status: 'OK', data: {} }))
  })
}
