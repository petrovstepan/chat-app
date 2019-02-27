const handleSession = (socket, next) => {
  const { user = null } =
    (socket.handshake.session && socket.handshake.session.passport) || {}
  socket.user = user

  if (user) {
    next()
  } else {
    next(new Error('NOT_AUTHORIZED'))
  }
}

module.exports = {
  handleSession,
}
