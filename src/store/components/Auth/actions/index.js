import axios from 'axios'
export const LOGOUT = 'LOGOUT'

export const logout = () => async dispatch => {
  const json = await axios
    .post(`/api/logout`)
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
      type: LOGOUT,
    })
  }
}
