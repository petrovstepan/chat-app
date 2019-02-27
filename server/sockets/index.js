const onlineUsersListeners = require('./onlineUsers')
const chatUsersListeners = require('./chatUsers')
const chatListListeners = require('./chatList')

module.exports = io => {
  const onlineUsers = io.of('/online-users')
  const chatList = io.of('/chatlist')
  const chatUsers = io.of('/chat')

  onlineUsersListeners(onlineUsers)
  chatUsersListeners(chatUsers, onlineUsers, chatList)
  chatListListeners(chatList)
}
