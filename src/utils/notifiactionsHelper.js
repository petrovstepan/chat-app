import { NEW_CHAT, NEW_MESSAGE, USER_JOINED } from '../SocketEvents'

export const getNotificationMessage = ({ type, friend, msg = null }) => {
  const { name } = friend

  switch (type) {
    case NEW_CHAT:
      return `${name} начал с вами новый диалог`
    case NEW_MESSAGE:
      return `${name}: ${
        msg.text.length > 30 ? `${msg.text.substr(0, 30)}...` : msg.text
      }`
    case USER_JOINED:
      return `${name} присоединился`
    default:
      return ''
  }
}
