import React from 'react'
import PaperWrapper from '../PaperWrapper'
import './Main.scss'

const Main = props => {
  const { isLogged, user } = props

  return (
    <PaperWrapper>
      {isLogged ? (
        <div className="main-text-wrapper">
          <span>{`Здравствйте, ${
            user.name
          }! Вы можете начать общение прямо сейчас. Выберите собеседника из списка онлайн или продолжите существующий диалог.`}</span>
        </div>
      ) : (
        <div className="main-text-wrapper">
          <span>
            Добро пожаловать в chat-app. Для начала общения необходима
            авторизация ВКонтакте, нажмите кнокпу <strong>Войти</strong>
          </span>
        </div>
      )}
    </PaperWrapper>
  )
}

export default Main
