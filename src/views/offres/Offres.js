import React, { lazy, useEffect, useState, forwardRef } from 'react'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  split,
  useQuery,
  gql,
} from '@apollo/client'
import { TailSpin } from 'react-loader-spinner'

import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { CNav, CNavItem, CNavLink, CCol, CCard, CCardHeader, CCardBody, CRow } from '@coreui/react'
import MUIDataTable from 'mui-datatables'
import { getDatabase, ref, onValue } from 'firebase/database'
export const GRAPHQL_ENDPOINT = 'https://unextra.hasura.app/v1/graphql'
export const GRAPHQL_SUBSCRIPTIONS = 'wss://unextra.hasura.app/v1/graphql'
export const SECRET_KEY = '2tGF4WeLMIOsP/Q/h/VS2cd++EmJzMcb'
export const AUTH_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYW5vbnltb3VzIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFub255bW91cyJ9fQ.HM2vL95bDWL2xTMwCXXDatxlfLMd_8-Mx1ymyMiCKb4'

const db = getDatabase()

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))

const columns = [
  {
    name: 'publicationDate',
    label: 'Date publication',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'dateStart',
    label: 'Date début',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'category',
    label: 'categorie',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'job',
    label: 'job',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'hoursPerWeek',
    label: 'Heures / semaine',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'salary',
    label: 'Salaire',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'city',
    label: 'ville',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'isValidate',
    label: 'Validé',
    options: {
      filter: true,
      sort: true,
    },
  },
]

const options = {
  filterType: 'checkbox',
}

const Offres = () => {
  const [mode, setMode] = useState(0)
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createApolloClient()
    async function fetchData() {
      client
        .query({
          query: gql`
            query {
              offer(limit: 10000) {
                id
                publicationDate
                job
                hoursPerWeek
                category
                city
                dateStart
                isValidate
                salary
              }
            }
          `,
        })
        .then((result) => {
          const offers = result.data.offer
            .filter((x) => x.publicationDate)
            .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate))

          setOffers(offers)
        })
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
    fetchData()
  }, [])
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
      <CRow>
        <CCol xs={12}>
          <MUIDataTable
            title={'Liste des offres'}
            data={offers}
            columns={columns}
            options={options}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default Offres
