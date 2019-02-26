import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store'
import axiosInterceptor from './utils/axiosHelper'
import { BrowserRouter as Router } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
const { dispatch } = store
axiosInterceptor(dispatch)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)
