const { handleSession } = require('../helpers/socketHelper')

module.exports = chatList => {
  chatList.use(handleSession)
  chatList.on('connection', socket => {
    const { user } = socket
    socket.join(user.id)
  })
}
