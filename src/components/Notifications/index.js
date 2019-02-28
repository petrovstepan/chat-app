import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import './Notifications.scss'
import { Link } from 'react-router-dom'
import { CSSTransitionGroup } from 'react-transition-group'
import { Avatar } from 'material-ui'
import pt from 'prop-types'
import { notificationType } from '../../utils/propTypesHelper'

// override defaults
const style = {
  position: 'auto',
  left: '',
  bottom: '',
  zIndex: '',
  transform: '',
  transition: '',
  visibility: '',
}

class Notifications extends React.Component {
  handleRequestClose = id => () => {
    this.props.removeNotification(id)
  }

  renderNotifications = notifications => {
    return Object.keys(notifications).map(k => {
      const n = notifications[k]
      const { friend, chatId = null } = n

      return (
        <Snackbar
          key={k}
          open={true}
          message={
            <div className="ava-text-wrapper">
              {friend.photo && <Avatar size={30} src={friend.photo} />}
              <span>{n.text}</span>
            </div>
          }
          action={chatId && <Link to={`/chat/${chatId}`}>Читать</Link>}
          className={`notification`}
          style={style}
          contentStyle={{ opacity: '', transition: '', display: 'flex' }}
          bodyStyle={{ backgroundColor: '', transition: '' }}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose(k)}
        />
      )
    })
  }

  render() {
    const { notifications } = this.props

    return (
      <div className="notifications-wrapper">
        <CSSTransitionGroup
          transitionName="notification-transition"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {this.renderNotifications(notifications)}
        </CSSTransitionGroup>
      </div>
    )
  }
}

export default Notifications

Notifications.propTypes = {
  notifications: pt.objectOf(notificationType),

  removeNotification: pt.func.isRequired,
}
