import React from 'react'
import './Chat.scss'
import io from 'socket.io-client'
import { Avatar, TextField } from 'material-ui'
import Paper from 'material-ui/Paper'
import {
  FRIEND_IS_TYPING,
  JOIN_CHAT,
  NEW_MESSAGE,
  GET_CHAT_PARAMS,
} from '../../SocketEvents'
import ThreeDotLoader from '../loaders/ThreeDotLoader'

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.friendId = null
    this.chat = React.createRef()

    this.state = {
      inpVal: '',
    }

    const { match, user, chatId = match.params.id } = props
    const r = new RegExp(`^${user.id}_([a-z0-9]+)$`, 'i')

    if (r.test(chatId)) {
      ;[, this.friendId] = chatId.split('_')
    }

    this.io = io('/chat', {
      query: {
        friendId: this.friendId,
        chatId: this.friendId ? '' : chatId,
      },
      autoConnect: false,
    })
    this.ioListeners(this.io)
  }

  getChat = () => (this.chat && this.chat.current) || false
  clearInp = () => this.setState({ inpVal: '' })

  componentDidMount() {
    this.io.connect()
  }

  componentWillUnmount() {
    this.io.disconnect()
    this.props.resetChatState()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { props } = this
    const {
      params: chatParams,
      history,
      messages,
      id: urlId = props.match.params.id,
    } = props
    const {
      params: oldChatParams,
      history: oldHistory,
      messages: oldMessages,
      id: oldUrlId = prevProps.match.params.id,
    } = prevProps

    if (this.processUrlMatchChange(urlId, oldUrlId, chatParams)) return

    // если чат меняется на другой валидный чат, то загружаем историю снова
    // поменяется при подключении сокета к новому чату
    if (this.processChatMessagesStateChange(chatParams, oldChatParams)) return

    this.processScrollOnMessagesChange(
      history,
      oldHistory,
      messages,
      oldMessages
    )
  }

  parseUrlParams = id => {
    const { user } = this.props
    let friendId
    const r = new RegExp(`^${user.id}_([a-z0-9]+)$`, 'i')

    if (r.test(id)) {
      ;[, friendId] = id.split('_')
      return { friendId }
    }
    return { chatId: id }
  }

  ioListeners = io => {
    const { addMessage, setFriendIsTyping } = this.props

    io.once(GET_CHAT_PARAMS, params => this.props.setChatParams(params))
    io.on(NEW_MESSAGE, msg => {
      addMessage(msg)
    })
    io.on(JOIN_CHAT, chatId => io.emit(JOIN_CHAT, chatId))
    io.on(FRIEND_IS_TYPING, () => {
      setFriendIsTyping(true)
      this.friendIsTyping = null
      this.friendIsTyping = setTimeout(() => setFriendIsTyping(false), 1500) // будет перезаписываться и продляться каждый раз
    })

    io.on('error', msg => {
      console.log('error')
    })
    io.on('disconnect', () => {})
  }

  renderMessages = (messages, history = false) =>
    messages.map(msg => {
      const { friend, user = this.props.user } = this.props.params
      const me = user.id === msg.userId

      return (
        <div
          key={msg._id}
          className={
            `message ${(me && 'me') || ''} ` + `${history && 'history'}`
          }
        >
          <Avatar
            className="message-avatar"
            src={
              me
                ? user.photo || '/assets/img/avatar.jpg'
                : friend.photo || '/assets/img/avatar.jpg'
            }
            style={{
              height: '1.8em',
              width: 'auto',
            }}
          />
          <span className="message-text">{msg.text}</span>
        </div>
      )
    })

  sendMessage = msg => {
    const io = this.io
    const { addMessage } = this.props

    io &&
      msg &&
      io.emit(NEW_MESSAGE, msg, msg => {
        this.clearInp()
        addMessage(msg)
      })
  }

  initiateNewChatSocket = queryParam => {
    this.io.disconnect()
    this.io = null
    this.io = io('/chat', {
      query: { ...queryParam },
    })
    this.ioListeners(this.io)
  }

  processUrlMatchChange = (id, oldId, chatParams) => {
    console.log(id, oldId)
    if (oldId !== id) {
      const params = this.parseUrlParams(id)
      if (params.friendId) {
        // если параметр id в url типа myId_friendId
        if (chatParams.friend._id !== params.friendId) {
          // chatParams.friend._id должен быть всегда, если id валидные
          this.initiateNewChatSocket(params)
        }
      } else {
        // если id в виде прямого id чата
        if (chatParams.chatId !== params.chatId) {
          this.initiateNewChatSocket(params)
        }
      }
      return true
    }
    return false
  }

  processChatMessagesStateChange = (chatParams, oldChatParams) => {
    const { chatId: oldChatId = '', friend: oldFriend } = oldChatParams
    const { chatId = '', friend } = chatParams

    if (chatId) {
      // если есть чат
      if (oldChatId) {
        // и раньше был
        if (chatId !== oldChatId) {
          // если это разные чаты
          this.props.getMessageHistory(chatId) // то загрузим историю
          return true
        }
        // если раньше чата не было
      } else if (!oldFriend || oldFriend._id !== friend._id) {
        // и не было пользователя или он изменился
        this.props.getMessageHistory(chatId) // то загрузим историю, потому что мы перешли из несуществующего чата в существующий, либо инициализировали чат
        return true
      }
    } else if (oldChatId) {
      // если чата нет
      this.props.resetMessages() // уберем сообщения. Мы либо переключились на другой чат либо на невалидный
      return true
    }
    return false
  }

  processScrollOnMessagesChange = (
    history,
    oldHistory,
    messages,
    oldMessages
  ) => {
    if (messages.length > oldMessages.length) {
      this.scrollToNewMessage()
    } else if (history.length > oldHistory.length) {
      this.initialScrollToHistory()
    }
  }

  initialScrollToHistory = () => {
    const chat = this.getChat()
    chat.scrollIntoView({ behavior: 'auto', block: 'end' })
  }

  scrollToNewMessage = () => {
    const { userIsReadingChatHistory } = this.props
    const chat = this.getChat()

    if (!userIsReadingChatHistory) {
      chat.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }

  onScroll = e => {
    const { userIsReadingChatHistory, setUserIsReadingHistory } = this.props
    const chat = this.getChat()
    if (chat) {
      const scrollerBottom = e.currentTarget.getBoundingClientRect().bottom
      const chatBottom = chat.getBoundingClientRect().bottom
      const diff = chatBottom - scrollerBottom
      const isReading = diff > 20

      if (isReading !== userIsReadingChatHistory) {
        setUserIsReadingHistory(isReading)
      }
    }
  }

  onKeyPress = e => this.io.emit(FRIEND_IS_TYPING) // решил не ставить ограничения по коду клавиш и срабатывать на все
  onKeyUp = e => {
    if (e.key.toString().toLowerCase() === 'enter') {
      e.preventDefault()
      this.sendMessage(e.target.value.trim())
    }
  }
  onChange = e => this.setState({ inpVal: e.target.value })

  render() {
    const { messages, history } = this.props
    const { usersOnline, friendIsTyping } = this.props
    const { friend } = this.props.params
    const friendIsOnline = Object.keys(usersOnline).includes(friend._id) || ''
    const { inpVal } = this.state
    const chatRef = this.chat

    return (
      <div className="wrapper">
        <Paper zDepth={2} className="paper">
          <div className="status-bar">
            {friend._id && ( // не отображаем если друг не загрузился
              <React.Fragment>
                <div
                  className={`ava-wrap friend-status ${friendIsOnline &&
                    'online'}`}
                >
                  <Avatar
                    className="friend-avatar"
                    src={friend.photo || '/assets/avatar.jpg'}
                    style={{
                      height: '100%',
                      width: 'auto',
                    }}
                  />
                </div>
                <span className="friend-name">{friend.name}</span>
                {friendIsTyping && <ThreeDotLoader center text={'печатает'} />}
              </React.Fragment>
            )}
          </div>
          <div className="chat-wrapper">
            <div className="scroller" onScroll={this.onScroll}>
              <div ref={chatRef} className={'chat'}>
                {this.renderMessages(history, true)}
                {this.renderMessages(messages)}
              </div>
            </div>
          </div>
          <TextField
            hintText={(friend.name && `Привет, ${friend.name}!`) || 'Привет!'}
            floatingLabelText="Напишите сообщение"
            onKeyDown={this.onKeyUp}
            onKeyPress={this.onKeyPress}
            onChange={this.onChange}
            multiLine
            fullWidth
            rows={2}
            rowsMax={3}
            value={inpVal}
          />
        </Paper>
      </div>
    )
  }
}

export default Chat
