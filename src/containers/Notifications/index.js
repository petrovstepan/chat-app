import Notifications from '../../components/Notifications'
import { connect } from 'react-redux'
import { removeNotification } from '../../store/components/Notifications/actions'

const mapStateToProps = state => ({
  notifications: state.notifications,
})

const mapDispatchToProps = dispatch => ({
  removeNotification: id => dispatch(removeNotification(id)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications)
