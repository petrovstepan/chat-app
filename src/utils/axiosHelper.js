import axios from 'axios'
import { LOGOUT } from '../store/components/Auth/actions'

export default dispatch => {
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401) {
        dispatch({
          type: LOGOUT,
        })
      }
      return Promise.reject(error)
    }
  )
}
