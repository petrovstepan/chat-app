import React from 'react'

/**
 * Checks whether the user is logged and redirects to /auth if not
 */

const withAuthButNoRedirect = Component => {
  const WithAuthButNoRedirect = props =>
    (props.isLogged && props.user.id && <Component {...props} />) || null

  WithAuthButNoRedirect.displayName = `WithAuthButNoRedirect(${Component.displayName ||
    Component.name ||
    'Component'})`
  return WithAuthButNoRedirect
}

export default withAuthButNoRedirect
