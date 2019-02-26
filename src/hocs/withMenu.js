import React from 'react'
import { menu, AUTHORIZE_ONLY, NON_AUTHORIZE_ONLY } from '../config/menu'

const withMenu = Component => {
  const WithMenu = props => {
    const { isLogged } = props
    const filteredMenu = menu.filter(
      item =>
        !item.rules.includes(isLogged ? NON_AUTHORIZE_ONLY : AUTHORIZE_ONLY)
    )

    return <Component {...props} menu={filteredMenu} />
  }

  WithMenu.displayName = `WithMenu(${Component.displayName ||
    Component.name ||
    'Component'})`

  return WithMenu
}

export default withMenu
