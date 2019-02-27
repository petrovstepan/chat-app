const { handleSession } = require('../helpers/socketHelper')
const {
  USER_JOINED,
  GET_USERS_ONLINE,
  USER_LEFT,
} = require('../../src/SocketEvents')

module.exports = onlineUsers => {
  onlineUsers.use(handleSession)

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
}
