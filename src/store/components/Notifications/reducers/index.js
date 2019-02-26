import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../actions'

const initialState = {}

export const notificationReducer = (state = initialState, action) => {
  const p = action.payload
  const type = action.type
  let messages

  switch (type) {
    case ADD_NOTIFICATION:
      return {
        ...state,
        [p.id]: p,
      }
    case REMOVE_NOTIFICATION:
      messages = state
      delete messages[p]
      return {
        ...messages,
      }
    default:
      return state
  }
}
