import React from 'react'
import PaperLoader from '../components/loaders/PaperLoader'

const withLoading = Component => {
  const WithLoading = props => {
    const { isLoading } = props
    return (isLoading && <PaperLoader />) || <Component {...props} />
  }

  WithLoading.displayName = `WithLoading(${Component.displayName ||
    Component.name ||
    'Component'})`

  return WithLoading
}

export default withLoading
