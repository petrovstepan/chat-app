import React from 'react'
import ChatError from '../ChatError'
import { CHAT_DOESNT_EXIST, NOT_A_CHAT_MEMBER } from '../../../SocketEvents'

const Error = props => {
  const defaultText = 'Произошла неизвестная ошибка'
  const { type, text = defaultText } = props
  let Component

  const errorTypes = {
    chat: {
      types: [CHAT_DOESNT_EXIST, NOT_A_CHAT_MEMBER],
      handler: ChatError,
    },
  }

  Object.keys(errorTypes).forEach(
    k =>
      errorTypes[k].types.includes(type) && (Component = errorTypes[k].handler)
  )

  return Component ? (
    <Component {...props} />
  ) : (
    <div className="default-error">
      <span className="error-text">{text}</span>
    </div>
  )
}

export default Error
