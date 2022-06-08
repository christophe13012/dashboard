import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import store from './store'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  split,
  useQuery,
  gql,
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyBpl62VOwT6totZxn3LPHrnt4JhG3xjWdI',
  authDomain: 'unextra-prod.firebaseapp.com',
  databaseURL: 'https://unextra-prod-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'unextra-prod',
  storageBucket: 'unextra-prod.appspot.com',
  messagingSenderId: '705321915257',
  appId: '1:705321915257:web:dfa27120f912c0a40e15a8',
  measurementId: 'G-9L9NKZV52Y',
}

const app = initializeApp(firebaseConfig)

export const GRAPHQL_ENDPOINT = 'https://unextra.hasura.app/v1/graphql'
export const GRAPHQL_SUBSCRIPTIONS = 'wss://unextra.hasura.app/v1/graphql'
export const SECRET_KEY = '2tGF4WeLMIOsP/Q/h/VS2cd++EmJzMcb'
export const AUTH_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYW5vbnltb3VzIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFub255bW91cyJ9fQ.HM2vL95bDWL2xTMwCXXDatxlfLMd_8-Mx1ymyMiCKb4'

const database = getDatabase(app)

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    headers: {
      Authorization: `Bearer ${AUTH_JWT}`,
    },
  })

  const wsLink = new WebSocketLink({
    uri: GRAPHQL_SUBSCRIPTIONS,
    headers: {
      Authorization: `Bearer ${AUTH_JWT}`,
    },
    options: {
      reconnect: true,
    },
  })

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink,
  )

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  })
}

const client = createApolloClient()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
