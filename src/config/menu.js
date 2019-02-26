import OnlineUsersDropdown from '../containers/OnlineUsersDropdown'

export const AUTHORIZE_ONLY = 'AUTHORIZE_ONLY'
export const NON_AUTHORIZE_ONLY = 'NON_AUTHORIZE_ONLY'

export const menu = [
  {
    id: 1,
    text: 'Войти',
    to: '',
    href: '/auth/vk',
    rules: [NON_AUTHORIZE_ONLY],
  },
  {
    id: 2,
    text: 'Выйти',
    to: '/logout',
    rules: [AUTHORIZE_ONLY],
  },
  {
    id: 3,
    text: 'Чаты',
    to: '/chatlist',
    rules: [AUTHORIZE_ONLY],
  },
  {
    id: 4,
    text: '',
    to: '',
    rules: [AUTHORIZE_ONLY],
    component: OnlineUsersDropdown,
  },
]
