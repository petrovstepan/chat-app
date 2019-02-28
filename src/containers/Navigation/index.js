import Navigation from '../../components/Navigation'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  isLogged: state.auth.isLogged,
})

export default connect(mapStateToProps)(Navigation)
