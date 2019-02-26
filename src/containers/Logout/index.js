import Logout from '../../components/Logout'
import { connect } from 'react-redux'
import { logout } from '../../store/components/Auth/actions'

const mapStateToProps = state => ({
  isLogged: state.auth.isLogged,
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout)
