import { connect } from 'react-redux'
import OnlineUserSocket from '../../components/OnlineUserSocket'
import {
  setUsersOnline,
  userLeave,
  userJoin,
} from '../../store/components/UsersOnline/actions'
import withAuthButNoRedirect from '../../hocs/withAuthButNoRedirect'
import { addNotification } from '../../store/components/Notifications/actions'

const mapStateToProps = state => ({
  ...state.auth,
})

const mapDispatchToProps = dispatch => ({
  setUsersOnline: users => dispatch(setUsersOnline(users)),
  userLeave: id => dispatch(userLeave(id)),
  userJoin: user => dispatch(userJoin(user)),
  addNotification: obj => dispatch(addNotification(obj)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthButNoRedirect(OnlineUserSocket))
