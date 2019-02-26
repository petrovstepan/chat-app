import React from 'react'
import io from 'socket.io-client'
import {
  GET_USERS_ONLINE,
  NEW_CHAT,
  NEW_MESSAGE,
  USER_JOINED,
  USER_LEFT,
} from '../../SocketEvents'

class OnlineUserSocket extends React.Component {
  constructor(props) {
    super(props)
    this.io = io('/online-users', { autoConnect: false })
  }

  componentDidMount() {
    const io = this.io
    const { userJoin, setUsersOnline, userLeave, addNotification } = this.props

    io.on('connect', () => {
      io.emit(GET_USERS_ONLINE, null, users => setUsersOnline(users))
    })
    io.on(USER_JOINED, user => {
      userJoin(user)
      addNotification({ id: user.id, friend: user, type: USER_JOINED })
    })
    io.on(USER_LEFT, id => userLeave(id))
    io.on(NEW_CHAT, obj => addNotification({ ...obj, type: NEW_CHAT }))
    io.on(NEW_MESSAGE, obj => addNotification({ ...obj, type: NEW_MESSAGE }))
    io.connect()
  }

  componentWillUnmount() {
    this.io.disconnect()
    this.io = null
  }

  render() {
    return null
  }
}

export default OnlineUserSocket
