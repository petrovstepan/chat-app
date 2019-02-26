import axios from 'axios'
export const UPDATE_LAST_MESSAGE = 'UPDATE_LAST_MESSAGE'
export const GET_CHATS_SUCCESS = 'GET_CHATS_SUCCESS'
export const GET_CHATS_FAIL = 'GET_CHATS_FAIL'
export const ADD_CHAT = 'ADD_CHAT'
export const GET_CHATS_REQUEST = 'GET_CHATS_REQUEST'
export const FRIEND_IS_TYPING_CHATLIST = 'FRIEND_IS_TYPING_CHATLIST'

export const setFriendIsTyping = (typing, chatId) => ({
  type: FRIEND_IS_TYPING_CHATLIST,
  payload: { chatId, typing },
})

export const updateLastMessage = msg => ({
  type: UPDATE_LAST_MESSAGE,
  payload: msg,
})

export const getChats = () => async dispatch => {
  dispatch({
    type: GET_CHATS_REQUEST,
  })

  const json = await axios
    .get(`/api/user/chats`)
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
            error: 'Неизвестная ошибка сервера',
          },
        }
      }
      return json
    })

  if (json.status === 'OK') {
    dispatch({
      type: GET_CHATS_SUCCESS,
      payload: json.data.chats,
    })
  } else {
    dispatch({
      type: GET_CHATS_FAIL,
      error: true,
      payload: {
        type: 500,
        text: 'ошибка',
      },
    })
  }
}
