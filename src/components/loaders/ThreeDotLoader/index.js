import React from 'react'
import './ThreeDotLoader.scss'

class ThreeDotLoader extends React.Component {
  constructor() {
    super()
    this.ref = React.createRef()
  }

  render() {
    const { style = {}, text, center } = this.props

    if (center) {
      style.marginLeft = 'auto'
      style.marginRight = `calc(50% - ${(this.ref.current &&
        this.ref.current.offsetWidth / 2) ||
        '5'}px)`
    }

    return (
      <div ref={this.ref} className="loader" style={style}>
        <div className="dot-loader">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        {text && <span className="text">{text}</span>}
      </div>
    )
  }
}

export default ThreeDotLoader
