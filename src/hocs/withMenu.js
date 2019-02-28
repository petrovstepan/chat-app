import React from 'react'
import { menu, AUTHORIZE_ONLY, NON_AUTHORIZE_ONLY } from '../config/menu'
import pt from 'prop-types'

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

  WithMenu.propTypes = {
    isLogged: pt.bool.isRequired,
  }

  return WithMenu
}

export default withMenu
