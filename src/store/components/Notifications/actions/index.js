import { getNotificationMessage } from '../../../../utils/notifiactionsHelper'

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

export const addNotification = obj => {
  return {
    type: ADD_NOTIFICATION,
    payload: { ...obj, text: getNotificationMessage(obj) },
  }
}

export const removeNotification = id => ({
  type: REMOVE_NOTIFICATION,
  payload: id,
})
