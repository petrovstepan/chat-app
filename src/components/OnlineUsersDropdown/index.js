import React from 'react'
import { Avatar, FlatButton, IconMenu, MenuItem } from 'material-ui'
import { Link } from 'react-router-dom'
import pt from 'prop-types'
import { userType } from '../../utils/propTypesHelper'

const OnlineUsersDropdown = props => {
  const { usersOnline: users, user } = props

  const renderUsers = users =>
    Object.keys(users).map(id => {
      const u = users[id]
      return (
        <Link key={id} to={`/chat/${user.id}_${id}`}>
          <MenuItem
            primaryText={u.name}
            leftIcon={<Avatar src={u.photo || '/assets/img/avatar.jpg'} />}
          />
        </Link>
      )
    })

  return (
    <IconMenu
      iconButtonElement={
        <FlatButton labelStyle={{ color: 'white' }} label="Онлайн" />
      }
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      targetOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {Object.keys(users).length ? (
        renderUsers(users)
      ) : (
        <MenuItem
          primaryText="Нет пользователей в сети"
          leftIcon={<Avatar src="/assets/img/avatar.jpg" />}
          disabled
        />
      )}
    </IconMenu>
  )
}

export default OnlineUsersDropdown

OnlineUsersDropdown.propTypes = {
  isLogged: pt.bool.isRequired,
  user: pt.shape({
    id: pt.string.isRequired,
    name: pt.string.isRequired,
    photo: pt.string.isRequired, // можно было был регулярку для url добавить, но длинно выйдет
    url: pt.string.isRequired,
  }).isRequired,

  usersOnline: pt.objectOf(userType),
}
