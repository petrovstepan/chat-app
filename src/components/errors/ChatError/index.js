import React from 'react'
import './ChatError.scss'

// displayed inside chat window

const ChatError = props => {
  const { text } = props

  return (
    <div className="chat-error">
      <span className="error-text">{text}</span>
    </div>
  )
}

export default ChatError
