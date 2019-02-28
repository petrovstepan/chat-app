import React from 'react'
import { FlatButton } from 'material-ui'
import { Link } from 'react-router-dom'
import withMenu from '../../hocs/withMenu'
import pt from 'prop-types'

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

Navigation.propTypes = {
  menu: pt.arrayOf(
    pt.shape({
      id: pt.oneOfType([pt.string, pt.number]).isRequired,

      text: pt.string,
      to: pt.string,
      href: pt.string,

      rules: pt.arrayOf(pt.oneOfType([pt.string, pt.number])).isRequired,

      component: pt.func, // функция, которая возвращает компонент. PropTypes.element не подходит
    }).isRequired
  ).isRequired,
}
