import { CHAT_DOESNT_EXIST, NOT_A_CHAT_MEMBER } from '../SocketEvents'

export const getErrorText = type => {
  switch (type) {
    case CHAT_DOESNT_EXIST:
      return 'Чата не существует'
    case NOT_A_CHAT_MEMBER:
      return 'Вы не являетесь участником этого чата. Доступ запрещен'
    default:
      return 'Произошла неизвестная ошибка'
  }
}
