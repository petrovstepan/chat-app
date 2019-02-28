import React from 'react'
import pt from 'prop-types'

const withDataLoading = Component =>
  class DataLoader extends React.Component {
    static propTypes = {
      loadData: pt.func.isRequired,
    }

    componentDidMount() {
      this.props.loadData()
    }

    render() {
      return <Component {...this.props} />
    }
  }

export default withDataLoading
