import React from 'react'
import PaperError from '../components/errors/PaperError'

const withError = Component => {
  const WithError = props => {
    const { error } = props

    return (error.type && <PaperError {...error} />) || <Component {...props} />
  }

  WithError.displayName = `WithError(${Component.displayName ||
    Component.name ||
    'Component'})`

  return WithError
}

export default withError
