import OnlineUsersDropdown from '../../components/OnlineUsersDropdown'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  ...state.auth,
  usersOnline: state.usersOnline,
})

export default connect(mapStateToProps)(OnlineUsersDropdown)
