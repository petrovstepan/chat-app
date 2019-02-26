import React from 'react'
import { Redirect } from 'react-router-dom'

/**
 * Checks whether the user is logged and redirects to /auth if not
 */

const withAuth = Component => {
  const WithAuth = props =>
    (props.isLogged && props.user.id && <Component {...props} />) || (
      <Redirect to="/" />
    )

  WithAuth.displayName = `WithAuth(${Component.displayName ||
    Component.name ||
    'Component'})`
  return WithAuth
}

export default withAuth
