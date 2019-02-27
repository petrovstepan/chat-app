import React from 'react'

const withDataLoading = Component =>
  class DataLoader extends React.Component {
    componentDidMount() {
      this.props.loadData()
    }

    render() {
      return <Component {...this.props} />
    }
  }

export default withDataLoading
