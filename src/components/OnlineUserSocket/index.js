import React from 'react'
import io from 'socket.io-client'
import {
  GET_USERS_ONLINE,
  NEW_CHAT,
  NEW_MESSAGE,
  USER_JOINED,
  USER_LEFT,
} from '../../SocketEvents'
import pt from 'prop-types'

class OnlineUserSocket extends React.Component {
  constructor(props) {
    super(props)
    this.io = io('/online-users', { autoConnect: false })
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false
  }

  testUrl = url => {
    const { user } = this.props
    const chatWithFriendIdUrl = new RegExp(
      `^/chat/${user.id}_([a-z0-9]+)$`,
      'i'
    )
    const chatWithChatIdUrl = new RegExp(`^/chat/([a-z0-9]+)$`, 'i')

    if (chatWithFriendIdUrl.test(url)) {
      return { friendId: chatWithFriendIdUrl.exec(url)[1] }
    }
    if (chatWithChatIdUrl.test(url)) {
      return { chatId: chatWithChatIdUrl.exec(url)[1] }
    }
    if (url === '/chatlist') {
      return { chatlist: true }
    }

    return null
  }

  createMessageNotification = obj => {
    const url = this.props.location.pathname
    const { friend, chatId } = obj
    const params = this.testUrl(url)

    // не показываем если пользователь в чате с пользователем
    if (
      !(params && (params.chatId === chatId || params.friendId === friend.id))
    ) {
      this.props.addNotification({ ...obj, type: NEW_MESSAGE })
    }
  }

  createChatNotification = obj => {
    const url = this.props.location.pathname
    const { friend } = obj
    const params = this.testUrl(url)

    // не показываем, если пользователь в чате с пользователем или в разделе с чатами
    if (!(params && (params.friendId === friend.id || params.chatlist))) {
      this.props.addNotification({ ...obj, type: NEW_CHAT })
    }
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
    io.on(NEW_CHAT, obj => this.createChatNotification(obj))
    io.on(NEW_MESSAGE, obj => this.createMessageNotification(obj))
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

OnlineUserSocket.propTypes = {
  isLogged: pt.bool.isRequired,

  user: pt.shape({
    id: pt.string.isRequired,
    name: pt.string.isRequired,
    photo: pt.string.isRequired,
    url: pt.string.isRequired,
  }).isRequired,

  setUsersOnline: pt.func.isRequired,
  userLeave: pt.func.isRequired,
  userJoin: pt.func.isRequired,
  addNotification: pt.func.isRequired,
}
