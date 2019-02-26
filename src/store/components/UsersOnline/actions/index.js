export const USER_JOIN = 'USER_JOIN'
export const USER_LEAVE = 'USER_LEAVE'
export const SET_USERS_ONLINE = 'SET_USERS_ONLINE'

export const userJoin = user => ({
  type: USER_JOIN,
  payload: user,
})

export const userLeave = id => ({
  type: USER_LEAVE,
  payload: { id },
})

export const setUsersOnline = users => ({
  type: SET_USERS_ONLINE,
  payload: users,
})
