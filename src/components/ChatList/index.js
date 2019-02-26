import React from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import { FRIEND_IS_TYPING, NEW_CHAT, NEW_MESSAGE } from '../../SocketEvents'
import './ChatList.scss'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Subheader from 'material-ui/Subheader'
import Avatar from 'material-ui/Avatar'
import Paper from 'material-ui/Paper'
import ThreeDotLoader from '../../components/loaders/ThreeDotLoader'

class ChatList extends React.Component {
  constructor(props) {
    super(props)
    this.io = io('/chatlist', { autoConnect: false })
  }

  componentDidMount() {
    const io = this.io
    const { getChats, updateLastMessage, setFriendIsTyping } = this.props
    getChats()

    io.on(NEW_CHAT, () => getChats())
    io.on(NEW_MESSAGE, msg => updateLastMessage(msg))
    io.on(FRIEND_IS_TYPING, chatId => {
      setFriendIsTyping(true, chatId)
      this.friendIsTyping = null
      this.friendIsTyping = setTimeout(
        () => setFriendIsTyping(false, chatId),
        1500
      ) // будет перезаписываться и продляться каждый раз
    })
    io.connect()
  }

  componentWillUnmount() {
    this.io.disconnect()
    this.io = null
    this.friendIsTyping = null
  }

  renderChats = chats =>
    chats.map((chat, i) => {
      const user = chat.users[0]
      const isOnline =
        Object.keys(this.props.usersOnline).includes(user._id) || ''
      return (
        <React.Fragment key={chat._id}>
          <ListItem
            containerElement={<Link to={`/chat/${chat._id}`} />}
            leftAvatar={
              <div className={`ava-wrap friend-status ${isOnline && 'online'}`}>
                <Avatar
                  src={user.photo || '/assets/img/avatar.jpg'}
                  style={{ height: '100%', width: 'auto' }}
                />
              </div>
            }
            primaryText={user.name}
            secondaryText={
              chat.friendIsTyping ? (
                <ThreeDotLoader text={'печатает'} />
              ) : (
                <p>{(chat.lastMessage && chat.lastMessage.text) || ''}</p>
              )
            }
            secondaryTextLines={2}
          />
          {i + 1 < chats.length && <Divider inset={true} />}
        </React.Fragment>
      )
    })

  render() {
    const { chats } = this.props.chatList

    return (
      <div className="chatlist-wrapper">
        <Paper zDepth={2}>
          <List>
            <Subheader>Чаты</Subheader>
            {this.renderChats(chats)}
          </List>
        </Paper>
      </div>
    )
  }
}

export default ChatList
