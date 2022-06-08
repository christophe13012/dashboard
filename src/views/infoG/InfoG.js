import React, { lazy, useEffect, useState } from 'react'
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
import { TailSpin } from 'react-loader-spinner'

import { CNav, CNavItem, CNavLink, CCol, CCard, CCardHeader, CCardBody, CRow } from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import { getDatabase, ref, onValue } from 'firebase/database'

export const GRAPHQL_ENDPOINT = 'https://unextra.hasura.app/v1/graphql'
export const GRAPHQL_SUBSCRIPTIONS = 'wss://unextra.hasura.app/v1/graphql'
export const SECRET_KEY = '2tGF4WeLMIOsP/Q/h/VS2cd++EmJzMcb'
export const AUTH_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYW5vbnltb3VzIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFub255bW91cyJ9fQ.HM2vL95bDWL2xTMwCXXDatxlfLMd_8-Mx1ymyMiCKb4'

const db = getDatabase()

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))

const InfoG = () => {
  const [mode, setMode] = useState(0)
  const [messages24, setMessages24] = useState([])
  const [messagesSemaine, setMessagesSemaine] = useState([])
  const [messagesMois, setMessagesMois] = useState([])
  const [messagesAll, setMessagesAll] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createApolloClient()
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const oneWeekAgo = new Date()
    const oneMonthAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 8)
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 31)
    async function fetchData() {
      client
        .query({
          query: gql`
            query {
              messages(limit: 1000000) {
                id
                date
              }
            }
          `,
        })
        .then((result) => {
          const messages = result.data.messages
          const messagesDay = messages.filter((x) => {
            return new Date(x.date).getTime() > yesterday.getTime()
          })
          const messagesWeek = messages.filter((x) => {
            return (
              new Date(x.date).getTime() < today.getTime() &&
              new Date(x.date).getTime() > oneWeekAgo.getTime()
            )
          })
          const messagesMois = messages.filter((x) => {
            return (
              new Date(x.date).getTime() < today.getTime() &&
              new Date(x.date).getTime() > oneMonthAgo.getTime()
            )
          })
          const messagesAll = messages.filter((x) => {
            return new Date(x.date).getTime() < today.getTime()
          })
          setMessages24(messagesDay)
          setMessagesSemaine(messagesWeek)
          setMessagesMois(messagesMois)
          setMessagesAll(messagesAll)
        })
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
    fetchData()
  }, [])
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

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

  return loading ? (
    <CRow className="justify-content-center">
      <CCol className="p-4" xs={6}>
        <TailSpin height="100" width="100" color="grey" ariaLabel="loading" />
      </CCol>
    </CRow>
  ) : (
    <>
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink
            onClick={() => setMode(0)}
            active={mode == 0 ? true : false}
            style={{ cursor: 'pointer', color: mode == 0 ? '#2500D2' : 'black' }}
          >
            Dernieres 24h
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            onClick={() => setMode(1)}
            active={mode == 1 ? true : false}
            style={{ cursor: 'pointer', color: mode == 1 ? '#2500D2' : 'black' }}
          >
            Semaine
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            onClick={() => setMode(2)}
            active={mode == 2 ? true : false}
            style={{ cursor: 'pointer', color: mode == 2 ? '#2500D2' : 'black' }}
          >
            Mois
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            onClick={() => setMode(3)}
            active={mode == 3 ? true : false}
            style={{ cursor: 'pointer', color: mode == 3 ? '#2500D2' : 'black' }}
          >
            Total
          </CNavLink>
        </CNavItem>
      </CNav>
      {mode == 0 && (
        <>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre messages échangés : {messages24.length}</div>
            </CCol>
          </CRow>
        </>
      )}
      {mode == 1 && (
        <>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre messages échangés : {messagesSemaine.length}</div>
            </CCol>
          </CRow>
        </>
      )}
      {mode == 2 && (
        <>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre messages échangés : {messagesMois.length}</div>
            </CCol>
          </CRow>
        </>
      )}
      {mode == 3 && (
        <>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre messages échangés : {messagesAll.length}</div>
            </CCol>
          </CRow>
        </>
      )}
    </>
  )
}

export default InfoG
