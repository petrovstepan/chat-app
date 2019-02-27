import { connect } from 'react-redux'
import ChatList from '../../components/ChatList'
import withAuth from '../../hocs/withAuth'
import {
  updateLastMessage,
  getChats,
  setFriendIsTyping,
} from '../../store/components/ChatList/actions'
import withLoading from '../../hocs/withLoading'
import withError from '../../hocs/withError'
import withDataLoading from '../../hocs/withDataLoading'

const mapStateToProps = state => ({
  ...state.auth,
  ...state.chatList,
  usersOnline: state.usersOnline,
})

const mapDispatchToProps = dispatch => ({
  getChats: () => dispatch(getChats()),
  loadData: () => dispatch(getChats()), // для DataLoader'a
  updateLastMessage: msg => dispatch(updateLastMessage(msg)),
  setFriendIsTyping: (typing, chatId) =>
    dispatch(setFriendIsTyping(typing, chatId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(withDataLoading(withError(withLoading(ChatList)))))
