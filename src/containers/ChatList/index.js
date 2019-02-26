import { connect } from 'react-redux'
import ChatList from '../../components/ChatList'
import withAuth from '../../hocs/withAuth'
import {
  updateLastMessage,
  getChats,
  setFriendIsTyping,
} from '../../store/components/ChatList/actions'

const mapStateToProps = state => ({
  ...state.auth,
  chatList: state.chatList,
  usersOnline: state.usersOnline,
})

const mapDispatchToProps = dispatch => ({
  getChats: () => dispatch(getChats()),
  updateLastMessage: msg => dispatch(updateLastMessage(msg)),
  setFriendIsTyping: (typing, chatId) =>
    dispatch(setFriendIsTyping(typing, chatId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(ChatList))
