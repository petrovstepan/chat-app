import React from 'react'
import PaperError from '../components/errors/PaperError'
import pt from 'prop-types'

const withError = Component => {
  const WithError = props => {
    const { error } = props

    return (error.type && <PaperError {...error} />) || <Component {...props} />
  }

  WithError.displayName = `WithError(${Component.displayName ||
    Component.name ||
    'Component'})`

  WithError.propTypes = {
    error: pt.shape({
      type: pt.oneOfType([pt.string, pt.number]).isRequired,
      text: pt.string,
    }).isRequired,
  }

  return WithError
}

export default withError
