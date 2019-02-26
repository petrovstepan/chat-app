import {
  ADD_MESSAGE,
  GET_MESSAGE_HISTORY_FAIL,
  GET_MESSAGE_HISTORY_REQUEST,
  GET_MESSAGE_HISTORY_SUCCESS,
  FRIEND_IS_TYPING,
  USER_IS_READING,
  RESET_CHAT_STATE,
  SET_CHAT_PARAMS,
  RESET_MESSAGES,
} from '../actions'

const emptyError = {
  type: '',
  text: '',
}

const initialState = {
  params: {
    chatId: '',
    friend: {},
  },
  history: [],
  messages: [],
  userIsReadingChatHistory: false,
  friendIsTyping: false,
  isLoading: false,
  error: emptyError,
}

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }

    case GET_MESSAGE_HISTORY_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: emptyError,
      }
    case USER_IS_READING:
      return {
        ...state,
        userIsReadingChatHistory: action.payload,
      }
    case GET_MESSAGE_HISTORY_SUCCESS:
      return {
        ...state,
        history: action.payload.messages,
        messages: [],
        isLoading: false,
        error: emptyError,
      }
    case GET_MESSAGE_HISTORY_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    case FRIEND_IS_TYPING:
      return {
        ...state,
        friendIsTyping: action.payload,
      }
    case RESET_CHAT_STATE:
      return initialState
    case SET_CHAT_PARAMS:
      return {
        ...state,
        params: action.payload,
      }
    case RESET_MESSAGES:
      return {
        ...state,
        history: [],
        messages: [],
      }
    default:
      return {
        ...state,
      }
  }
}
