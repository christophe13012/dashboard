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
import { departement } from 'src/utils/utils.js'

import { CNav, CNavItem, CNavLink, CCol, CCard, CCardHeader, CCardBody, CRow } from '@coreui/react'
import { CChartDoughnut } from '@coreui/react-chartjs'

import { getDatabase, ref, onValue } from 'firebase/database'

export const GRAPHQL_ENDPOINT = 'https://unextra.hasura.app/v1/graphql'
export const GRAPHQL_SUBSCRIPTIONS = 'wss://unextra.hasura.app/v1/graphql'
export const SECRET_KEY = '2tGF4WeLMIOsP/Q/h/VS2cd++EmJzMcb'
export const AUTH_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYW5vbnltb3VzIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFub255bW91cyJ9fQ.HM2vL95bDWL2xTMwCXXDatxlfLMd_8-Mx1ymyMiCKb4'

const db = getDatabase()

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))

const Employeurs = () => {
  const [mode, setMode] = useState(0)
  const [actifs, setActifs] = useState([])
  const [extras24Dep, setExtras24Dep] = useState([])
  const [extrasSemaineDep, setExtrasSemaineDep] = useState([])
  const [extrasMoisDep, setExtrasMoisDep] = useState([])
  const [extrasAllDep, setExtrasAllDep] = useState([])
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
  const [offers24Cat, setOffers24Cat] = useState([])
  const [offers24Job, setOffers24Job] = useState([])
  const [offersSemaineCat, setOffersSemaineCat] = useState([])
  const [offersSemaineJob, setOffersSemaineJob] = useState([])
  const [offersMoisCat, setOffersMoisCat] = useState([])
  const [offersMoisJob, setOffersMoisJob] = useState([])
  const [offersAllCat, setOffersAllCat] = useState([])
  const [offersAllJob, setOffersAllJob] = useState([])
  const [offers24State, setOffers24State] = useState([])
  const [offersSemaineState, setOffersSemaineState] = useState([])
  const [offersMoisState, setOffersMoisState] = useState([])
  const [offersAllState, setOffersAllState] = useState([])
  const [missions24Cat, setMissions24Cat] = useState([])
  const [missions24Job, setMissions24Job] = useState([])
  const [missionsSemaineCat, setMissionsSemaineCat] = useState([])
  const [missionsSemaineJob, setMissionsSemaineJob] = useState([])
  const [missionsMoisCat, setMissionsMoisCat] = useState([])
  const [missionsMoisJob, setMissionsMoisJob] = useState([])
  const [missionsAllCat, setMissionsAllCat] = useState([])
  const [missionsAllJob, setMissionsAllJob] = useState([])
  const [missions24State, setMissions24State] = useState([])
  const [missionsSemaineState, setMissionsSemaineState] = useState([])
  const [missionsMoisState, setMissionsMoisState] = useState([])
  const [missionsAllState, setMissionsAllState] = useState([])
  const [missions, setMissions] = useState([])
  const [missionsValidateAll, setMissionsValidateAll] = useState([])
  const [missionsValidateExtra, setMissionsValidateExtra] = useState([])
  const [missionsValidateEmployeur, setMissionsValidateEmployeur] = useState([])
  const [offers, setOffers] = useState([])
  const [offersValidated, setOffersValidated] = useState([])
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
              mission(limit: 10000) {
                id
                datePublication
                category
                job
                isValidateByExtra
                isValidateByCompany
              }
            }
          `,
        })
        .then((result) => {
          const missions = result.data.mission
          setMissions(missions)
          const missionsBoth = missions.filter((x) => {
            return x.isValidateByExtra && x.isValidateByCompany
          })
          const missionsExtra = missions.filter((x) => {
            return x.isValidateByExtra && !x.isValidateByCompany
          })
          const missionsEmployeur = missions.filter((x) => {
            return !x.isValidateByExtra && x.isValidateByCompany
          })
          setMissionsValidateAll(missionsBoth)
          setMissionsValidateEmployeur(missionsEmployeur)
          setMissionsValidateExtra(missionsExtra)
          const missionsDay = missions.filter((x) => {
            return new Date(x.datePublication).getTime() > yesterday.getTime()
          })
          const missionsWeek = missions.filter((x) => {
            return (
              new Date(x.datePublication).getTime() < today.getTime() &&
              new Date(x.datePublication).getTime() > oneWeekAgo.getTime()
            )
          })
          const missionsMois = missions.filter((x) => {
            return (
              new Date(x.datePublication).getTime() < today.getTime() &&
              new Date(x.datePublication).getTime() > oneMonthAgo.getTime()
            )
          })
          const missionsAll = missions.filter((x) => {
            return new Date(x.datePublication).getTime() < today.getTime()
          })
          const missionGroupByCategory24 = missionsDay.reduce((group, product) => {
            const { category } = product
            group[category] = group[category] ?? []
            group[category].push(product)
            return group
          }, {})
          const missionGroupByCategorySemaine = missionsWeek.reduce((group, product) => {
            const { category } = product
            group[category] = group[category] ?? []
            group[category].push(product)
            return group
          }, {})
          const missionGroupByCategoryMois = missionsMois.reduce((group, product) => {
            const { category } = product
            group[category] = group[category] ?? []
            group[category].push(product)
            return group
          }, {})
          const missionGroupByCategoryAll = missionsAll.reduce((group, product) => {
            const { category } = product
            group[category] = group[category] ?? []
            group[category].push(product)
            return group
          }, {})
          const missionGroupByJob24 = missionsDay.reduce((group, product) => {
            const { job } = product
            group[job] = group[job] ?? []
            group[job].push(product)
            return group
          }, {})
          const missionGroupByJobSemaine = missionsWeek.reduce((group, product) => {
            const { job } = product
            group[job] = group[job] ?? []
            group[job].push(product)
            return group
          }, {})
          const missionGroupByJobMois = missionsMois.reduce((group, product) => {
            const { job } = product
            group[job] = group[job] ?? []
            group[job].push(product)
            return group
          }, {})
          const missionGroupByJobAll = missionsAll.reduce((group, product) => {
            const { job } = product
            group[job] = group[job] ?? []
            group[job].push(product)
            return group
          }, {})
          setMissions24Cat(missionGroupByCategory24)
          setMissionsSemaineCat(missionGroupByCategorySemaine)
          setMissionsMoisCat(missionGroupByCategoryMois)
          setMissionsAllCat(missionGroupByCategoryAll)
          setMissions24Job(missionGroupByJob24)
          setMissionsSemaineJob(missionGroupByJobSemaine)
          setMissionsMoisJob(missionGroupByJobMois)
          setMissionsAllJob(missionGroupByJobAll)
          setMissions24State(missionsDay)
          setMissionsSemaineState(missionsWeek)
          setMissionsMoisState(missionsMois)
          setMissionsAllState(missionsAll)
        })
      client
        .query({
          query: gql`
            query {
              offer(limit: 10000) {
                id
                publicationDate
                category
                job
                isValidate
              }
            }
          `,
        })
        .then((result) => {
          const offers = result.data.offer
          setOffers(offers)
          const offersValid = offers.filter((x) => {
            return x.isValidate
          })
          setOffersValidated(offersValid)
          const offersDay = offers.filter((x) => {
            return new Date(x.publicationDate).getTime() > yesterday.getTime()
          })
          const offersWeek = offers.filter((x) => {
            return (
              new Date(x.publicationDate).getTime() < today.getTime() &&
              new Date(x.publicationDate).getTime() > oneWeekAgo.getTime()
            )
          })
          const offersMois = offers.filter((x) => {
            return (
              new Date(x.publicationDate).getTime() < today.getTime() &&
              new Date(x.publicationDate).getTime() > oneMonthAgo.getTime()
            )
          })
          const offersAll = offers.filter((x) => {
            return new Date(x.publicationDate).getTime() < today.getTime()
          })
          const offerGroupByCategory24 = offersDay.reduce((group, product) => {
            const { category } = product
            group[category] = group[category] ?? []
            group[category].push(product)
            return group
          }, {})
          const offerGroupByCategorySemaine = offersWeek.reduce((group, product) => {
            const { category } = product
            group[category] = group[category] ?? []
            group[category].push(product)
            return group
          }, {})
          const offerGroupByCategoryMois = offersMois.reduce((group, product) => {
            const { category } = product
            group[category] = group[category] ?? []
            group[category].push(product)
            return group
          }, {})
          const offerGroupByCategoryAll = offersAll.reduce((group, product) => {
            const { category } = product
            group[category] = group[category] ?? []
            group[category].push(product)
            return group
          }, {})
          const offerGroupByJob24 = offersDay.reduce((group, product) => {
            const { job } = product
            group[job] = group[job] ?? []
            group[job].push(product)
            return group
          }, {})
          const offerGroupByJobSemaine = offersWeek.reduce((group, product) => {
            const { job } = product
            group[job] = group[job] ?? []
            group[job].push(product)
            return group
          }, {})
          const offerGroupByJobMois = offersMois.reduce((group, product) => {
            const { job } = product
            group[job] = group[job] ?? []
            group[job].push(product)
            return group
          }, {})
          const offerGroupByJobAll = offersAll.reduce((group, product) => {
            const { job } = product
            group[job] = group[job] ?? []
            group[job].push(product)
            return group
          }, {})
          setOffers24Cat(offerGroupByCategory24)
          setOffersSemaineCat(offerGroupByCategorySemaine)
          setOffersMoisCat(offerGroupByCategoryMois)
          setOffersAllCat(offerGroupByCategoryAll)
          setOffers24Job(offerGroupByJob24)
          setOffersSemaineJob(offerGroupByJobSemaine)
          setOffersMoisJob(offerGroupByJobMois)
          setOffersAllJob(offerGroupByJobAll)
          setOffers24State(offersDay)
          setOffersSemaineState(offersWeek)
          setOffersMoisState(offersMois)
          setOffersAllState(offersAll)
        })
      client
        .query({
          query: gql`
            query {
              user(where: { type: { _eq: "EMPLOYER" } }, limit: 10000) {
                id
                postalCode
                category
                company {
                  id
                }
              }
            }
          `,
        })
        .then((result) => {
          const actifsRef = ref(db, 'checkStatus')
          onValue(actifsRef, (snapshot) => {
            const data = snapshot.val()
            const comptesActifs = []
            Object.keys(data).forEach((x) => {
              if (data[x].status) {
                comptesActifs.push({ uid: x, type: data[x].type })
              }
            })
            console.log('comptesActifs', comptesActifs)
            setActifs(comptesActifs)
          })
          const usersInWork = result.data.user
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
              return firebaseUsers24.includes(x.id)
            })
            const firebaseUsersSemaine = firebaseSemaine.map((x) => x.uid)
            let usersInWorkSemaine = usersInWork.filter((x) => {
              return firebaseUsersSemaine.includes(x.id)
            })
            const firebaseUsersMois = firebaseMois.map((x) => x.uid)
            let usersInWorkMois = usersInWork.filter((x) => {
              return firebaseUsersMois.includes(x.id)
            })
            const firebaseUsersAll = firebaseAll.map((x) => x.uid)
            let usersInWorkAll = usersInWork.filter((x) => {
              return firebaseUsersAll.includes(x.id)
            })
            setExtras24(usersInWork24)
            setExtrasSemaine(usersInWorkSemaine)
            setExtrasMois(usersInWorkMois)
            setExtrasAll(usersInWorkAll)

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
            setExtras24Cat(groupByCategory24)
            setExtrasSemaineCat(groupByCategorySemaine)
            setExtrasMoisCat(groupByCategoryMois)
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
        <CNavItem>
          <CNavLink
            onClick={() => setMode(4)}
            active={mode == 4 ? true : false}
            style={{ cursor: 'pointer', color: mode == 4 ? '#2500D2' : 'black' }}
          >
            Statistiques générales
          </CNavLink>
        </CNavItem>
      </CNav>
      {mode == 0 && (
        <>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre employeurs inscrits : {extras24.length}</div>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Employeurs inscrits par catégorie</CCardHeader>
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
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre offres publiées : {offers24State.length}</div>
            </CCol>
          </CRow>
          <CRow>
            {offers24State.length > 0 && (
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Offres publiées par catégorie</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(offers24Cat),
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
                            data: Object.values(offers24Cat).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            )}
            {offers24State.length > 0 && (
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Offres publiées par job</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(offers24Job),
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
                            data: Object.values(offers24Job).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            )}
          </CRow>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre missions publiées : {missions24State.length}</div>
            </CCol>
          </CRow>
          <CRow>
            {missions24State.length > 0 && (
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Missions publiées par catégorie</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(missions24Cat),
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
                            data: Object.values(missions24Cat).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            )}
            {missions24State.length > 0 && (
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Missions publiées par job</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(missions24Job),
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
                            data: Object.values(missions24Job).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            )}
          </CRow>
        </>
      )}
      {mode == 1 && (
        <>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre employeurs inscrits : {extrasSemaine.length}</div>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Employeurs inscrits par catégorie</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(extrasSemaineCat),
                      datasets: [
                        {
                          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
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
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre offres publiées : {offersSemaineState.length}</div>
            </CCol>
          </CRow>
          {offersSemaineState.length > 0 && (
            <CRow>
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Offres publiées par catégorie</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(offersSemaineCat),
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
                            data: Object.values(offersSemaineCat).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Offres publiées par job</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(offersSemaineJob),
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
                            data: Object.values(offersSemaineJob).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre missions publiées : {missionsSemaineState.length}</div>
            </CCol>
          </CRow>
          {missionsSemaineState.length > 0 && (
            <CRow>
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Missions publiées par catégorie</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(missionsSemaineCat),
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
                            data: Object.values(missionsSemaineCat).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Missions publiées par job</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(missionsSemaineJob),
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
                            data: Object.values(missionsSemaineJob).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </>
      )}
      {mode == 2 && (
        <>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre employeurs inscrits : {extrasMois.length}</div>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Employeurs inscrits par catégorie</CCardHeader>
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
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre offres publiées : {offersMoisState.length}</div>
            </CCol>
          </CRow>
          {offersMoisState.length > 0 && (
            <CRow>
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Offres publiées par catégorie</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(offersMoisCat),
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
                            data: Object.values(offersMoisCat).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Offres publiées par job</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(offersMoisJob),
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
                            data: Object.values(offersMoisJob).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre missions publiées : {missionsMoisState.length}</div>
            </CCol>
          </CRow>
          {missionsMoisState.length > 0 && (
            <CRow>
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Missions publiées par catégorie</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(missionsMoisCat),
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
                            data: Object.values(missionsMoisCat).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Missions publiées par job</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(missionsMoisJob),
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
                            data: Object.values(missionsMoisJob).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </>
      )}
      {mode == 3 && (
        <>
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre employeurs inscrits : {extrasAll.length}</div>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Employeurs inscrits par catégorie</CCardHeader>
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
          <CRow>
            <CCol xs={6}>
              <div className="mt-4">Nombre offres publiées : {offersAllState.length}</div>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Offres publiées par catégorie</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(offersAllCat),
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
                          data: Object.values(offersAllCat).map((x) => x.length),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6}>
              <CCard className="mb-4 mt-4">
                <CCardHeader>Offres publiées par job</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(offersAllJob),
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
                          data: Object.values(offersAllJob).map((x) => x.length),
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
              <div className="mt-4">Nombre missions publiées : {missionsAllState.length}</div>
            </CCol>
          </CRow>
          {missionsAllState.length > 0 && (
            <CRow>
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Missions publiées par catégorie</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(missionsAllCat),
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
                            data: Object.values(missionsAllCat).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={6}>
                <CCard className="mb-4 mt-4">
                  <CCardHeader>Missions publiées par job</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut
                      data={{
                        labels: Object.keys(missionsAllJob),
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
                            data: Object.values(missionsAllJob).map((x) => x.length),
                          },
                        ],
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </>
      )}
      {mode == 4 && (
        <CRow>
          <CCol xs={6}>
            <div className="mt-4">Nombre missions enregistrées : {missions.length}</div>
            <div className="mt-4">
              Nombre missions validées par employeur et extra : {missionsValidateAll.length}
            </div>
            <div className="mt-4">
              Nombre missions validées par employeur seulement : {missionsValidateEmployeur.length}
            </div>
            <div className="mt-4">
              Nombre missions validées par extra seulement : {missionsValidateExtra.length}
            </div>
            <div className="mt-4">Nombre offres enregistrées : {offers.length}</div>
            <div className="mt-4">Nombre offres validées : {offersValidated.length}</div>
            <div className="mt-4">Nombre comptes actifs : {actifs.length}</div>
            <div className="mt-4">
              Actifs IOS:{' '}
              {
                actifs.filter((x) =>
                  [
                    'com.unextra.unextraapp.subscribe',
                    'com.unextra.unextraapp.flasher',
                    'com.unextra.unextraapp.pro',
                  ].includes(x.type),
                ).length
              }
            </div>
            <div className="mt-1" style={{ fontSize: 14 }}>
              Flash:{' '}
              {actifs.filter((x) => ['com.unextra.unextraapp.flasher'].includes(x.type)).length}
            </div>
            <div className="mt-1" style={{ fontSize: 14 }}>
              Actifs classique:{' '}
              {actifs.filter((x) => ['com.unextra.unextraapp.subscribe'].includes(x.type)).length}
            </div>
            <div className="mt-1" style={{ fontSize: 14 }}>
              Actifs pro:{' '}
              {actifs.filter((x) => ['com.unextra.unextraapp.pro'].includes(x.type)).length}
            </div>
            <div className="mt-4">
              Actifs Android:{' '}
              {
                actifs.filter((x) =>
                  ['unextra.abonnement', 'unextra.pro', 'unextra.flash'].includes(x.type),
                ).length
              }
            </div>
            <div className="mt-1" style={{ fontSize: 14 }}>
              Flash: {actifs.filter((x) => ['unextra.flash'].includes(x.type)).length}
            </div>
            <div className="mt-1" style={{ fontSize: 14 }}>
              Actifs classique:{' '}
              {actifs.filter((x) => ['unextra.abonnement'].includes(x.type)).length}
            </div>
            <div className="mt-1" style={{ fontSize: 14 }}>
              Actifs pro: {actifs.filter((x) => ['unextra.pro'].includes(x.type)).length}
            </div>
            <div className="mt-4">
              Actifs abonné depuis web: {actifs.filter((x) => x.type == 'Abonnement web').length}
            </div>
            <div className="mt-1">
              Actifs flash depuis web: {actifs.filter((x) => x.type == 'Flash web').length}
            </div>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default Employeurs
