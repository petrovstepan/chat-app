import React from 'react'
import PaperWrapper from '../../PaperWrapper'

const PaperError = props => {
  const defaultText = 'Произошла неизвестная ошибка'
  const { text = defaultText } = props

  return (
    <PaperWrapper>
      <span>{text}</span>
    </PaperWrapper>
  )
}

export default PaperError
