import React, { lazy, useEffect, useState } from 'react'
import { ApolloClient, InMemoryCache, HttpLink, split, gql } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { TailSpin } from 'react-loader-spinner'

import { CNav, CNavItem, CNavLink, CCol, CCard, CCardHeader, CCardBody, CRow } from '@coreui/react'
import { CChartDoughnut } from '@coreui/react-chartjs'

import { getDatabase, ref, onValue } from 'firebase/database'
import { departement } from 'src/utils/utils.js'

export const GRAPHQL_ENDPOINT = 'https://unextra.hasura.app/v1/graphql'
export const GRAPHQL_SUBSCRIPTIONS = 'wss://unextra.hasura.app/v1/graphql'
export const SECRET_KEY = '2tGF4WeLMIOsP/Q/h/VS2cd++EmJzMcb'
export const AUTH_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYW5vbnltb3VzIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFub255bW91cyJ9fQ.HM2vL95bDWL2xTMwCXXDatxlfLMd_8-Mx1ymyMiCKb4'

const db = getDatabase()

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))

const ExtrasPro = () => {
  const [mode, setMode] = useState(0)
  const [extras24, setExtras24] = useState([])
  const [extras24Cat, setExtras24Cat] = useState([])
  const [extras24Job, setExtras24Job] = useState([])
  const [extrasSemaine, setExtrasSemaine] = useState([])
  const [extrasSemaineCat, setExtrasSemaineCat] = useState([])
  const [extrasSemaineJob, setExtrasSemaineJob] = useState([])
  const [extrasMois, setExtrasMois] = useState([])
  const [extrasMoisCat, setExtrasMoisCat] = useState([])
  const [extrasMoisJob, setExtrasMoisJob] = useState([])
  const [extrasAll, setExtrasAll] = useState([])
  const [extrasAllCat, setExtrasAllCat] = useState([])
  const [extrasAllJob, setExtrasAllJob] = useState([])
  const [extras24Dep, setExtras24Dep] = useState([])
  const [extrasSemaineDep, setExtrasSemaineDep] = useState([])
  const [extrasMoisDep, setExtrasMoisDep] = useState([])
  const [extrasAllDep, setExtrasAllDep] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createApolloClient()
    async function fetchData() {
      const extras = await client.query({
        query: gql`
          query {
            extra(where: { isPro: { _eq: true } }, limit: 10000) {
              id
              job
              isPro
            }
          }
        `,
      })

      const extrasData = extras.data.extra

      const objExtras = {}

      extrasData.forEach((element) => {
        objExtras[element.id] = element.job
      })

      client
        .query({
          query: gql`
            query {
              user(limit: 100000) {
                id
                idExtra
                category
                gender
                postalCode
                company {
                  id
                  latitude
                }
              }
            }
          `,
        })
        .then((result) => {
          let usersInWork = result.data.user
          usersInWork = usersInWork.filter((x) => objExtras[x.idExtra])
          const today = new Date()
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const oneWeekAgo = new Date()
          const oneMonthAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 8)
          oneMonthAgo.setDate(oneMonthAgo.getDate() - 31)
          const usersListRef = ref(db, 'usersList')
          onValue(usersListRef, (snapshot) => {
            const data = snapshot.val()
            const firebase24 = data.filter((x) => {
              return new Date(x.metadata.creationTime).getTime() > yesterday.getTime()
            })
            const firebaseSemaine = data.filter((x) => {
              return (
                new Date(x.metadata.creationTime).getTime() < today.getTime() &&
                new Date(x.metadata.creationTime).getTime() > oneWeekAgo.getTime()
              )
            })
            const firebaseMois = data.filter((x) => {
              return (
                new Date(x.metadata.creationTime).getTime() < today.getTime() &&
                new Date(x.metadata.creationTime).getTime() > oneMonthAgo.getTime()
              )
            })
            const firebaseAll = data.filter((x) => {
              return new Date(x.metadata.creationTime).getTime() < today.getTime()
            })
            const firebaseUsers24 = firebase24.map((x) => x.uid)
            let usersInWork24 = usersInWork.filter((x) => {
              return firebaseUsers24.includes(x.id) && x.company == null
            })
            const firebaseUsersSemaine = firebaseSemaine.map((x) => x.uid)
            let usersInWorkSemaine = usersInWork.filter((x) => {
              return firebaseUsersSemaine.includes(x.id) && x.company == null
            })
            const firebaseUsersMois = firebaseMois.map((x) => x.uid)
            let usersInWorkMois = usersInWork.filter((x) => {
              return firebaseUsersMois.includes(x.id) && x.company == null
            })
            const firebaseUsersAll = firebaseAll.map((x) => x.uid)
            let usersInWorkAll = usersInWork.filter((x) => {
              return firebaseUsersAll.includes(x.id) && x.company == null
            })
            usersInWork24 = usersInWork24.map((x) => ({ ...x, job: objExtras[x.idExtra] }))
            usersInWorkSemaine = usersInWorkSemaine.map((x) => ({
              ...x,
              job: objExtras[x.idExtra],
            }))
            usersInWorkMois = usersInWorkMois.map((x) => ({
              ...x,
              job: objExtras[x.idExtra],
            }))
            usersInWorkAll = usersInWorkAll.map((x) => ({
              ...x,
              job: objExtras[x.idExtra],
            }))
            setExtras24(usersInWork24)
            setExtrasSemaine(usersInWorkSemaine)
            setExtrasMois(usersInWorkMois)
            setExtrasAll(usersInWorkAll)
            const groupByCategory24 = usersInWork24.reduce((group, product) => {
              const { category } = product
              group[category] = group[category] ?? []
              group[category].push(product)
              return group
            }, {})
            const groupByCategorySemaine = usersInWorkSemaine.reduce((group, product) => {
              const { category } = product
              group[category] = group[category] ?? []
              group[category].push(product)
              return group
            }, {})
            const groupBydep24 = usersInWork24.reduce((group, product) => {
              const { postalCode } = product
              const dep = postalCode ? postalCode.toString().substring(0, 2) : 'nc'
              group[departement[dep]] = group[departement[dep]] ?? []
              group[departement[dep]].push(product)
              return group
            }, {})
            const groupBydepSemaine = usersInWorkSemaine.reduce((group, product) => {
              const { postalCode } = product
              const dep = postalCode ? postalCode.toString().substring(0, 2) : 'nc'
              group[departement[dep]] = group[departement[dep]] ?? []
              group[departement[dep]].push(product)
              return group
            }, {})

            const groupBydepMois = usersInWorkMois.reduce((group, product) => {
              const { postalCode } = product
              const dep = postalCode ? postalCode.toString().substring(0, 2) : 'nc'
              group[departement[dep]] = group[departement[dep]] ?? []
              group[departement[dep]].push(product)
              return group
            }, {})

            const groupBydepAll = usersInWorkAll.reduce((group, product) => {
              const { postalCode } = product
              const dep = postalCode ? postalCode.toString().substring(0, 2) : 'nc'
              group[departement[dep]] = group[departement[dep]] ?? []
              group[departement[dep]].push(product)
              return group
            }, {})
            const groupByCategoryMois = usersInWorkMois.reduce((group, product) => {
              const { category } = product
              group[category] = group[category] ?? []
              group[category].push(product)
              return group
            }, {})
            const groupByCategoryAll = usersInWorkAll.reduce((group, product) => {
              const { category } = product
              group[category] = group[category] ?? []
              group[category].push(product)
              return group
            }, {})
            const groupByJob24 = usersInWork24.reduce((group, product) => {
              const { job } = product
              group[job] = group[job] ?? []
              group[job].push(product)
              return group
            }, {})
            const groupByJobSemaine = usersInWorkSemaine.reduce((group, product) => {
              const { job } = product
              group[job] = group[job] ?? []
              group[job].push(product)
              return group
            }, {})
            const groupByJobMois = usersInWorkMois.reduce((group, product) => {
              const { job } = product
              group[job] = group[job] ?? []
              group[job].push(product)
              return group
            }, {})
            const groupByJobAll = usersInWorkAll.reduce((group, product) => {
              const { job } = product
              group[job] = group[job] ?? []
              group[job].push(product)
              return group
            }, {})
            setExtras24Job(groupByJob24)
            setExtras24Cat(groupByCategory24)
            setExtrasSemaineJob(groupByJobSemaine)
            setExtrasSemaineCat(groupByCategorySemaine)
            setExtrasMoisJob(groupByJobMois)
            setExtrasMoisCat(groupByCategoryMois)
            setExtrasAllJob(groupByJobAll)
            setExtrasAllCat(groupByCategoryAll)
            setExtras24Dep(groupBydep24)
            setExtrasSemaineDep(groupBydepSemaine)
            setExtrasMoisDep(groupBydepMois)
            setExtrasAllDep(groupBydepAll)
          })
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
              <div className="mt-4">Nombre extras pro inscrits : {extras24.length}</div>
            </CCol>
          </CRow>
          {extras24.length > 0 && (
            <>
              <CRow>
                <CCol xs={6}>
                  <CCard className="mb-4 mt-4">
                    <CCardHeader>Extras pro inscrits par catégorie</CCardHeader>
                    <CCardBody>
                      <CChartDoughnut
                        data={{
                          labels: Object.keys(extras24Cat),
                          datasets: [
                            {
                              backgroundColor: [
                                '#41B883',
                                '#E46651',
                                '#00D8FF',
                                '#DD1B16',
                                '#FF0000',
                                '#800000',
                                '#808000',
                                '#00FF00',
                                '#008000',
                                '#808080',
                                '#0000FF',
                                '#000080',
                                '#FF00FF',
                                '#800080',
                              ],
                              data: Object.values(extras24Cat).map((x) => x.length),
                            },
                          ],
                        }}
                      />
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol xs={6}>
                  <CCard className="mb-4 mt-4">
                    <CCardHeader>Extras pro inscrits par job</CCardHeader>
                    <CCardBody>
                      <CChartDoughnut
                        data={{
                          labels: Object.keys(extras24Job),
                          datasets: [
                            {
                              backgroundColor: [
                                '#41B883',
                                '#E46651',
                                '#00D8FF',
                                '#DD1B16',
                                '#FF0000',
                                '#800000',
                                '#808000',
                                '#00FF00',
                                '#008000',
                                '#808080',
                                '#0000FF',
                                '#000080',
                                '#FF00FF',
                                '#800080',
                              ],
                              data: Object.values(extras24Job).map((x) => x.length),
                            },
                          ],
                        }}
                      />
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6}>
                  <CCard className="mb-4 mt-4">
                    <CCardHeader>Extras inscrits par Département</CCardHeader>
                    <CCardBody>
                      <CChartDoughnut
                        data={{
                          labels: Object.keys(extras24Dep),
                          datasets: [
                            {
                              backgroundColor: [
                                '#41B883',
                                '#E46651',
                                '#00D8FF',
                                '#DD1B16',
                                '#FF0000',
                                '#800000',
                                '#808000',
                                '#00FF00',
                                '#008000',
                                '#808080',
                                '#0000FF',
                                '#000080',
                                '#FF00FF',
                                '#800080',
                              ],
                              data: Object.values(extras24Dep).map((x) => x.length),
                            },
                          ],
                        }}
                      />
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </>
          )}
        </>
      )}
      {mode == 1 && (
        <>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre extras pro inscrits : {extrasSemaine.length}</div>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Extras pro inscrits par catégorie</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(extrasSemaineCat),
                      datasets: [
                        {
                          backgroundColor: [
                            '#41B883',
                            '#E46651',
                            '#00D8FF',
                            '#DD1B16',
                            '#FF0000',
                            '#800000',
                            '#808000',
                            '#00FF00',
                            '#008000',
                            '#808080',
                            '#0000FF',
                            '#000080',
                            '#FF00FF',
                            '#800080',
                          ],
                          data: Object.values(extrasSemaineCat).map((x) => x.length),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Extras pro inscrits par job</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(extrasSemaineJob),
                      datasets: [
                        {
                          backgroundColor: [
                            '#41B883',
                            '#E46651',
                            '#00D8FF',
                            '#DD1B16',
                            '#FF0000',
                            '#800000',
                            '#808000',
                            '#00FF00',
                            '#008000',
                            '#808080',
                            '#0000FF',
                            '#000080',
                            '#FF00FF',
                            '#800080',
                          ],
                          data: Object.values(extrasSemaineJob).map((x) => x.length),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Extras inscrits par Département</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(extrasSemaineDep),
                      datasets: [
                        {
                          backgroundColor: [
                            '#41B883',
                            '#E46651',
                            '#00D8FF',
                            '#DD1B16',
                            '#FF0000',
                            '#800000',
                            '#808000',
                            '#00FF00',
                            '#008000',
                            '#808080',
                            '#0000FF',
                            '#000080',
                            '#FF00FF',
                            '#800080',
                          ],
                          data: Object.values(extrasSemaineDep).map((x) => x.length),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
      {mode == 2 && (
        <>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre extras pro inscrits : {extrasMois.length}</div>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Extras pro inscrits par catégorie</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(extrasMoisCat),
                      datasets: [
                        {
                          backgroundColor: [
                            '#41B883',
                            '#E46651',
                            '#00D8FF',
                            '#DD1B16',
                            '#FF0000',
                            '#800000',
                            '#808000',
                            '#00FF00',
                            '#008000',
                            '#808080',
                            '#0000FF',
                            '#000080',
                            '#FF00FF',
                            '#800080',
                          ],
                          data: Object.values(extrasMoisCat).map((x) => x.length),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Extras pro inscrits par job</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(extrasMoisJob),
                      datasets: [
                        {
                          backgroundColor: [
                            '#41B883',
                            '#E46651',
                            '#00D8FF',
                            '#DD1B16',
                            '#FF0000',
                            '#800000',
                            '#808000',
                            '#00FF00',
                            '#008000',
                            '#808080',
                            '#0000FF',
                            '#000080',
                            '#FF00FF',
                            '#800080',
                          ],
                          data: Object.values(extrasMoisJob).map((x) => x.length),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Extras inscrits par Département</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(extrasMoisDep),
                      datasets: [
                        {
                          backgroundColor: [
                            '#41B883',
                            '#E46651',
                            '#00D8FF',
                            '#DD1B16',
                            '#FF0000',
                            '#800000',
                            '#808000',
                            '#00FF00',
                            '#008000',
                            '#808080',
                            '#0000FF',
                            '#000080',
                            '#FF00FF',
                            '#800080',
                          ],
                          data: Object.values(extrasMoisDep).map((x) => x.length),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
      {mode == 3 && (
        <>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre extras pro inscrits : {extrasAll.length}</div>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Extras pro inscrits par catégorie</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(extrasAllCat),
                      datasets: [
                        {
                          backgroundColor: [
                            '#41B883',
                            '#E46651',
                            '#00D8FF',
                            '#DD1B16',
                            '#FF0000',
                            '#800000',
                            '#808000',
                            '#00FF00',
                            '#008000',
                            '#808080',
                            '#0000FF',
                            '#000080',
                            '#FF00FF',
                            '#800080',
                          ],
                          data: Object.values(extrasAllCat).map((x) => x.length),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Extras pro inscrits par job</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(extrasAllJob),
                      datasets: [
                        {
                          backgroundColor: [
                            '#41B883',
                            '#E46651',
                            '#00D8FF',
                            '#DD1B16',
                            '#FF0000',
                            '#800000',
                            '#808000',
                            '#00FF00',
                            '#008000',
                            '#808080',
                            '#0000FF',
                            '#000080',
                            '#FF00FF',
                            '#800080',
                          ],
                          data: Object.values(extrasAllJob).map((x) => x.length),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Extras inscrits par Département</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(extrasAllDep),
                      datasets: [
                        {
                          backgroundColor: [
                            '#41B883',
                            '#E46651',
                            '#00D8FF',
                            '#DD1B16',
                            '#FF0000',
                            '#800000',
                            '#808000',
                            '#00FF00',
                            '#008000',
                            '#808080',
                            '#0000FF',
                            '#000080',
                            '#FF00FF',
                            '#800080',
                          ],
                          data: Object.values(extrasAllDep).map((x) => x.length),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </>
  )
}

export default ExtrasPro
