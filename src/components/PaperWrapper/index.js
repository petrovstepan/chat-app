import React from 'react'
import Paper from 'material-ui/Paper'
import './PaperWrapper.scss'

const PaperWrapper = props => {
  return (
    <div className="paper-wrapper">
      <Paper zDepth={2}>{props.children}</Paper>
    </div>
  )
}

export default PaperWrapper
