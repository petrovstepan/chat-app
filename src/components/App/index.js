import React from 'react'
import './App.scss'
import ChatList from '../../containers/ChatList'
import OnlineUserSocket from '../../containers/OnlineUserSocket'
import Chat from '../../containers/Chat'
import AppBar from 'material-ui/AppBar'
import Forum from 'material-ui/svg-icons/communication/forum'
import { IconButton } from 'material-ui'
import Navigation from '../../containers/Navigation'
import { Switch, Link, Route } from 'react-router-dom'
import Logout from '../../containers/Logout'
import Notifications from '../../containers/Notifications'
import Main from '../../containers/Main'

const App = () => (
  <div className="app">
    <AppBar
      title="Chat-app"
      iconElementLeft={
        <Link to="/">
          <IconButton>
            <Forum color="white" />
          </IconButton>
        </Link>
      }
      className="app-header"
      style={{ backgroundColor: '' }}
      showMenuIconButton={true}
    >
      <Navigation />
    </AppBar>
    <main>
      {/*Только сокет для залогинненого пользователя, никакого рендера*/}
      <Route component={OnlineUserSocket} />
      {/*нужен доступ к url для контроля уведомлений*/}
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/chatlist" component={ChatList} />
        <Route exact path="/chat/:id" component={Chat} />
        {/**TODO: 404 NOT FOUND*/}
      </Switch>
      <Notifications />
    </main>
  </div>
)

export default App
