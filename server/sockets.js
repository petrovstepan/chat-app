const MessageModel = require('./models/messages.model')
const UserModel = require('./models/users.model')
const ChatModel = require('./models/chats.model')
const {
  NEW_CHAT,
  USER_JOINED,
  GET_USERS_ONLINE,
  USER_LEFT,
  NEW_MESSAGE,
  JOIN_CHAT,
  FRIEND_IS_TYPING,
  GET_CHAT_PARAMS,
} = require('../src/SocketEvents')

module.exports = io => {
  const handleSession = (socket, next) => {
    const { user = null } =
      (socket.handshake.session && socket.handshake.session.passport) || {}
    socket.user = user

    if (user) {
      next()
    } else {
      next(new Error('Client lost auth'))
    }
  }

  const onlineUsers = io.of('/online-users')
  const chatList = io.of('/chatlist')
  const chatUsers = io.of('/chat')

  onlineUsers.use(handleSession)
  chatList.use(handleSession)
  chatUsers.use(handleSession)

  onlineUsers.on('connection', async socket => {
    const user = socket.user
    socket.join(user.id) // чтобы иметь доступ из другого неймспейса
    socket.broadcast.emit(USER_JOINED, user)

    console.log(`${user.name} connected to online`)

    socket.on(GET_USERS_ONLINE, (msg, cb) => {
      const users = {}
      Object.keys(onlineUsers.sockets).forEach(key => {
        let su = onlineUsers.sockets[key].user
        return su.id.toString() !== user.id.toString() && (users[su.id] = su)
      })
      cb(users)
    })

    socket.on('disconnect', reason => {
      onlineUsers.emit(USER_LEFT, user.id)
    })
  })

  chatList.on('connection', socket => {
    const { user } = socket
    socket.join(user.id)
  })

  chatUsers.use(async (socket, next) => {
    console.log('joining to chat users')

    let { friendId, chatId } = socket.handshake.query
    const user = socket.user
    let chat, friend

    if (chatId) {
      chat = await ChatModel.findOne({
        _id: chatId,
      })
        .populate('users')
        .lean()
        .exec()
        .catch(err => {
          console.log('catched error btw')
        })
    } else if (friendId) {
      friend = await UserModel.findOne({
        _id: friendId,
      })
        .lean()
        .exec()
        .catch(() => {
          console.log('user dont exist')
        })

      if (friend) {
        chat = await ChatModel.findOne({
          users: {
            $all: [user.id, friendId],
          },
        })
          .populate('users')
          .lean()
          .exec()
          .catch(() => {
            console.log('catch err')
          })
      }
    } else {
      next(new Error('no chat'))
    }

    friend =
      friend ||
      (chat && chat.users.find(u => u._id.toString() !== user.id.toString()))

    if (chat) {
      socket.chat = chat
      socket.friend = friend
      next()
    } else if (friend) {
      socket.friend = friend
      next()
    } else {
      next(new Error('no chat'))
    }
  })

  chatUsers.on('connection', socket => {
    const { user, chat, friend, friendId = friend._id } = socket

    console.log(`${user.name} connected to chat users`)

    if (chat) {
      socket.join(chat._id)
    }
    socket.join(user.id)

    socket.emit(GET_CHAT_PARAMS, {
      chatId: (chat && chat._id) || '', // чат может быть еще не начат
      friend, // friend обязан быть всегда, иначе чат не валидный и сюда сокет не должен дойти
    })

    socket.on(JOIN_CHAT, chatId => socket.join(chatId)) // если оба открыли страницу чата, но самого чата еще не существует
    socket.on(FRIEND_IS_TYPING, () => {
      socket.to((chat && chat._id) || friendId).emit(FRIEND_IS_TYPING)
      if (chat && chat._id) {
        chatList.to(friendId).emit(FRIEND_IS_TYPING, chat._id)
      }
    })
    socket.on(NEW_MESSAGE, async (msg, cb) => {
      let { chat } = socket

      if (!chat) {
        // попробуем найти чат еще раз, на случай если другой пользователь уже начал его
        chat = await ChatModel.findOne({
          users: {
            $all: [user.id, friendId],
          },
        })
          .lean()
          .exec()
          .catch(err => {
            console.log('find chat err')
          })

        if (!chat) {
          console.log('create chat')
          chat = new ChatModel({
            users: [user.id, friendId],
          })

          chat = await chat.save().catch(err => {
            console.log('chat fail')
          })
          if (chat) {
            socket.join(chat._id)
            chatList.to(friendId).emit(NEW_CHAT, chat) // чтобы вызвать обновление списка чатов в /chatlist
            socket.to(friendId).emit(JOIN_CHAT, chat._id) // чтобы подключить собеседника, который тоже открыл страницу чата
            onlineUsers
              .to(friendId)
              .emit(NEW_CHAT, { id: chat._id, chatId: chat._id, friend: user })
          }
        }

        socket.chat = chat || null // чтобы в следующий раз взять из сокета
      }

      if (!chat) return

      msg = new MessageModel({
        text: msg,
        chatId: chat._id,
        userId: user.id,
      })

      msg = await msg.save().catch(err => {
        console.log(err)
        console.log('ошибка создания сообщения')
      })

      if (msg) {
        cb(msg)
        socket.to(chat._id).emit(NEW_MESSAGE, msg) // отправляем для отображения в чате
        chatList.to(friendId, user.id).emit(NEW_MESSAGE, msg) // обновляем последнее сообщение в /chatlist
        //chatList.to(user.id).emit(NEW_MESSAGE, msg)
        onlineUsers
          .to(friendId)
          .emit(NEW_MESSAGE, {
            id: msg._id,
            chatId: chat._id,
            msg,
            friend: user,
          })
      }
    })
  })
}
