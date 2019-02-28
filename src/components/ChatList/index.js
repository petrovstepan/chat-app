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
import pt from 'prop-types'

class ChatList extends React.Component {
  constructor(props) {
    super(props)
    this.io = io('/chatlist', { autoConnect: false })
  }

  componentDidMount() {
    const io = this.io
    const { getChats, updateLastMessage, setFriendIsTyping } = this.props

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
    const { chats } = this.props

    return (
      <div className="chatlist-wrapper">
        <Paper zDepth={2}>
          <List>
            <Subheader>Чаты</Subheader>
            {chats.length ? (
              this.renderChats(chats)
            ) : (
              <ListItem
                primaryText="У вас начатых диалогов"
                secondaryText="Выберите пользователя из списка онлайн и начните общение"
                secondaryTextLines={1}
                disabled
              />
            )}
          </List>
        </Paper>
      </div>
    )
  }
}

export default ChatList

ChatList.propTypes = {
  isLogged: pt.bool.isRequired,

  user: pt.shape({
    id: pt.string.isRequired,
    name: pt.string.isRequired,
    photo: pt.string.isRequired, // можно было был регулярку для url добавить, но длинно выйдет
    url: pt.string.isRequired,
  }).isRequired,

  isLoading: pt.bool.isRequired,

  chats: pt.arrayOf(
    pt.shape({
      _id: pt.string.isRequired,
      friendIsTyping: pt.bool, // при загрузке с сервера его изначально нет

      users: pt.arrayOf(
        pt.shape({
          _id: pt.string.isRequired,
          name: pt.string.isRequired,
          photo: pt.string.isRequired,
        }).isRequired // должен быть один user - тот с кем мы переписываемся
      ).isRequired,

      lastMessage: pt.shape({
        text: pt.string.isRequired,
        // возможно тут есть что-то еще
      }).isRequired,
    })
  ).isRequired,

  usersOnline: pt.object.isRequired, // в этом компоненте внутренняя структура пользователей не используется, нужны только ключи,
  // поэтому дополнительно проверять ничего не будем
  getChats: pt.func.isRequired,
  updateLastMessage: pt.func.isRequired,
  setFriendIsTyping: pt.func.isRequired,
}
