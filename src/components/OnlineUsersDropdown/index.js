import React from 'react'
import { Avatar, FlatButton, IconMenu, MenuItem } from 'material-ui'
import { Link } from 'react-router-dom'

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
    >
      {renderUsers(users)}
    </IconMenu>
  )
}

export default OnlineUsersDropdown
