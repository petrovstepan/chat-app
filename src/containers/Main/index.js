import Main from '../../components/Main'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  ...state.auth,
})

export default connect(mapStateToProps)(Main)
