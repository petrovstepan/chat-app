const UserModel = require('../../models/users.model')
const ChatModel = require('../../models/chats.model')
const { getErrorResponse } = require('../../helpers/respoonseHelpers')

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
    .catch(err => console.log('error catched'))

  req.chat = chat || null
  next()
}

const userHasRightsForChat = (req, resp, next) => {
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
      resp.status(403).json(getErrorResponse('У вас нет доступа к этому чату'))
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

module.exports = {
  checkChatExists,
  userHasRightsForChat,
  userExists,
}
