import Navigation from '../../components/Navigation'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  ...state.auth,
})

export default connect(mapStateToProps)(Navigation)
