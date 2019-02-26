import {
  ADD_CHAT,
  FRIEND_IS_TYPING_CHATLIST,
  GET_CHATS_FAIL,
  GET_CHATS_REQUEST,
  GET_CHATS_SUCCESS,
  UPDATE_LAST_MESSAGE,
} from '../actions'

const initialState = {
  chats: [],
  isLoading: false,
  error: {
    type: '',
    text: '',
  },
}

const findAndUpdateChat = (chats, id, assingObj) => {
  return chats.map(chat => {
    if (chat._id.toString() === id.toString()) {
      chat = { ...chat, ...assingObj }
    }
    return chat
  })
}

export const chatListReducer = (state = initialState, action) => {
  let chats
  switch (action.type) {
    case ADD_CHAT:
      chats = [...state.chats, action.payload]
      return {
        ...state,
        chats,
      }
    case GET_CHATS_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case GET_CHATS_SUCCESS:
      return {
        ...state,
        chats: action.payload,
        isLoading: false,
      }
    case GET_CHATS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: { type: 401, text: 'ошибка' },
      }
    case UPDATE_LAST_MESSAGE:
      const msg = action.payload
      chats = findAndUpdateChat(state.chats, msg.chatId, { lastMessage: msg })
      return {
        ...state,
        chats,
      }
    case FRIEND_IS_TYPING_CHATLIST:
      const { typing, chatId } = action.payload
      chats = findAndUpdateChat(state.chats, chatId, { friendIsTyping: typing })
      return {
        ...state,
        chats,
      }
    default:
      return state
  }
}
