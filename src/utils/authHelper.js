import { authFields } from '../store/config/auth'

export const getEmptyUser = () => {
  const user = {}
  authFields.forEach(item => (user[item] = ''))
  return user
}

export const getUserData = () => {
  return getCookies(authFields)
}

const getCookies = fields => {
  const user = {}
  fields.forEach(item => (user[item] = getCookie(item) || ''))
  return { user }
}

const getCookie = name => {
  var matches = document.cookie.match(
    new RegExp(
      // eslint-disable-next-line no-useless-escape
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}
