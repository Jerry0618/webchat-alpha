import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AppContainer } from 'react-hot-loader'

const rootEl = document.getElementById('webchat-root')
const webchatType = rootEl.dataset.webchatType
const webchatVersion = rootEl.dataset.webchatVersion

ReactDOM.render(
  <AppContainer>
    <App
      type={webchatType}
      version={webchatVersion}
    />
  </AppContainer>,
  rootEl
)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NewApp = require('./App').default
    ReactDOM.render(
      <AppContainer>
        <NewApp
          type={webchatType}
          version={webchatVersion}
        />
      </AppContainer>,
      rootEl
    )
  })
}
