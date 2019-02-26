import { USER_JOIN, USER_LEAVE, SET_USERS_ONLINE } from '../actions'

const initialState = {}

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_JOIN:
      return {
        ...state,
        [action.payload.id]: action.payload,
      }
    case USER_LEAVE:
      delete state[action.payload.id]
      return {
        ...state,
      }
    case SET_USERS_ONLINE:
      return {
        ...action.payload,
      }
    default:
      return state
  }
}
