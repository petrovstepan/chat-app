const { handleSession } = require('../helpers/socketHelper')
const ChatModel = require('../models/chats.model')
const UserModel = require('../models/users.model')
const MessageModel = require('../models/messages.model')
const {
  NEW_CHAT,
  NEW_MESSAGE,
  JOIN_CHAT,
  FRIEND_IS_TYPING,
  GET_CHAT_PARAMS,
  CHAT_DOESNT_EXIST,
  NOT_A_CHAT_MEMBER,
} = require('../../src/SocketEvents')

module.exports = (chatUsers, onlineUsers, chatList) => {
  chatUsers.use(handleSession)

  const userHasRightsForChat = (socket, next) => {
    const { chat, user, myId = user.id } = socket
    let userInChat
    if (chat) {
      userInChat = chat.users.find(
        user => user._id.toString() === myId.toString()
      ) // если чат был найден по chatId, а не юзерам
      if (userInChat) {
        next()
      } else {
        // чат существует, но пользователь не имеет к нему отношения
        next(new Error(NOT_A_CHAT_MEMBER))
      }
    } else {
      next()
    }
  }

  async function findChatOrFriend(socket, next) {
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
      if (friendId === user.id) {
        next(new Error(CHAT_DOESNT_EXIST)) // не разрешим чата с собой
      }

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
      next(new Error(CHAT_DOESNT_EXIST))
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
      next(new Error(CHAT_DOESNT_EXIST))
    }
  }

  chatUsers.use(findChatOrFriend)
  chatUsers.use(userHasRightsForChat)

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
          chat = new ChatModel({
            users: [user.id, friendId],
          })

          chat = await chat.save().catch(err => {
            console.log('catched err')
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
      })

      if (msg) {
        cb(msg)
        socket.to(chat._id).emit(NEW_MESSAGE, msg) // отправляем для отображения в чате
        chatList.to(friendId, user.id).emit(NEW_MESSAGE, msg) // обновляем последнее сообщение в /chatlist
        //chatList.to(user.id).emit(NEW_MESSAGE, msg)
        onlineUsers.to(friendId).emit(NEW_MESSAGE, {
          id: msg._id,
          chatId: chat._id,
          msg,
          friend: user,
        })
      }
    })
  })
}
