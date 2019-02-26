import Chat from '../../components/Chat'
import { connect } from 'react-redux'
import withAuth from '../../hocs/withAuth'
import {
  addMessage,
  getMessageHistory,
  setFriendIsTyping,
  setUserIsReadingHistory,
  resetChatState,
  resetMessages,
  setChatParams,
} from '../../store/components/Chat/actions'

const mapStateToProps = state => ({
  ...state.auth,
  ...state.chat,
  usersOnline: state.usersOnline,
})

const mapDispatchToProps = dispatch => ({
  addMessage: msg => dispatch(addMessage(msg)),
  getMessageHistory: id => dispatch(getMessageHistory(id)),
  setFriendIsTyping: typing => dispatch(setFriendIsTyping(typing)),
  setUserIsReadingHistory: isReading =>
    dispatch(setUserIsReadingHistory(isReading)),
  resetChatState: () => dispatch(resetChatState()),
  setChatParams: params => dispatch(setChatParams(params)),
  resetMessages: () => dispatch(resetMessages()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(Chat))
