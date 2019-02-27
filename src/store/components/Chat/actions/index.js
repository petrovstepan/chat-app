import axios from 'axios'
import { getErrorText } from '../../../../utils/errorHelper'

export const ADD_MESSAGE = 'ADD_MESSAGE'
export const GET_MESSAGE_HISTORY_REQUEST = 'GET_MESSAGE_HISTORY_REQUEST'
export const GET_MESSAGE_HISTORY_SUCCESS = 'GET_MESSAGE_HISTORY_SUCCESS'
export const GET_MESSAGE_HISTORY_FAIL = 'GET_MESSAGE_HISTORY_FAIL'
export const FRIEND_IS_TYPING = 'FRIEND_IS_TYPING'
export const USER_IS_READING = 'USER_IS_READING'
export const RESET_CHAT_STATE = 'RESET_CHAT_STATE'
export const SET_CHAT_PARAMS = 'SET_CHAT_PARAMS'
export const RESET_MESSAGES = 'RESET_MESSAGES'
export const SET_CHAT_ERROR = 'SET_CHAT_ERROR'
export const RESET_ERROR = 'RESET_ERROR'

export const addMessage = msg => ({
  type: ADD_MESSAGE,
  payload: msg,
})

export const setFriendIsTyping = typing => ({
  type: FRIEND_IS_TYPING,
  payload: typing,
})

export const setUserIsReadingHistory = isReading => ({
  type: USER_IS_READING,
  payload: isReading,
})

export const resetChatState = () => ({
  type: RESET_CHAT_STATE,
})

export const setChatParams = params => ({
  type: SET_CHAT_PARAMS,
  payload: params,
})

export const resetMessages = () => ({
  type: RESET_MESSAGES,
})

export const setChatError = type => ({
  type: SET_CHAT_ERROR,
  payload: { type, text: getErrorText(type) },
})

export const getMessageHistory = chatId => async dispatch => {
  dispatch({
    type: GET_MESSAGE_HISTORY_REQUEST,
  })

  const json = await axios
    .get(`/api/user/chats/${chatId}/messages`, { timeout: 5000 })
    .then(resp => {
      if (!resp.data.status) {
        throw new Error()
      }
      return resp.data
    })
    .catch(e => {
      const type = (e.response && e.response.status) || 500
      let json

      if (e.response && e.response.data && e.response.data.status) {
        json = e.response.data
        json.data.type = type
      } else {
        json = {
          status: 'FAIL',
          data: {
            type: type,
            text: 'Неизвестная ошибка сервера',
          },
        }
      }
      return json
    })

  if (json.status === 'OK') {
    dispatch({
      type: GET_MESSAGE_HISTORY_SUCCESS,
      payload: json.data,
    })
  } else {
    // часть ошибок будет отображаться через сокеты
    dispatch({
      type: GET_MESSAGE_HISTORY_FAIL,
      error: true,
      payload: {
        ...json.data,
      },
    })
  }
}
