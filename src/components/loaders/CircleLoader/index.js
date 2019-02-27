import React from 'react'
import { RefreshIndicator } from 'material-ui'
import './CircleLoader.scss'

const CircleLoader = props => {
  const { size = 50 } = props

  return (
    <div className="loader-wrapper">
      <div className="loader-container" style={{ height: size, width: size }}>
        <RefreshIndicator
          size={size}
          left={0}
          top={0}
          loadingColor="#FF9800"
          status="loading"
        />
      </div>
    </div>
  )
}

export default CircleLoader
