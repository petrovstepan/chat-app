import React from 'react'
import { FlatButton } from 'material-ui'
import { Link } from 'react-router-dom'
import withMenu from '../../hocs/withMenu'

const Navigation = props => {
  const { menu } = props

  const renderMenu = menu => {
    return menu.map(m => {
      if (m.component) {
        let Component = m.component
        return <Component key={m.id} />
      } else {
        return (
          <FlatButton
            key={m.id}
            containerElement={(m.to && <Link to={m.to} />) || null}
            href={m.href || ''}
            labelStyle={{ color: 'white' }}
            label={m.text}
          />
        )
      }
    })
  }

  return renderMenu(menu)
}

export default withMenu(Navigation)
