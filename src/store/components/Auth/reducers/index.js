import { LOGOUT } from '../actions'
import { getEmptyUser, getUserData } from '../../../../utils/authHelper'

const getInitialState = () => {
  const state = getUserData()
  state.isLogged = Boolean(state.user.id)
  return state
}

const initialState = getInitialState()

const emptyUser = getEmptyUser()

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return { ...state, isLogged: false, user: emptyUser }

    default:
      return state
  }
}
