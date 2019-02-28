import React from 'react'
import { Redirect } from 'react-router-dom'
import pt from 'prop-types'

class Logout extends React.Component {
  componentDidMount = () => this.props.logout()
  render = () => (this.props.isLogged ? null : <Redirect to="/" />)
}

export default Logout

Logout.propTypes = {
  isLogged: pt.bool.isRequired,
  logout: pt.func.isRequired,
}
