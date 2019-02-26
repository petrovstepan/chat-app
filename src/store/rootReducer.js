import { combineReducers } from 'redux'
import { authReducer } from './components/Auth/reducers'
import { usersReducer } from './components/UsersOnline/reducers'
import { chatListReducer } from './components/ChatList/reducers'
import { chatReducer } from './components/Chat/reducers'
import { notificationReducer } from './components/Notifications/reducers'

export const rootReducer = combineReducers({
  auth: authReducer,
  usersOnline: usersReducer,
  chatList: chatListReducer,
  chat: chatReducer,
  notifications: notificationReducer,
})
