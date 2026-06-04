import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import UserListComponent from "./backOfficeComponent.tsx/UserListComponent"
import StatisticheComponent from "./backOfficeComponent.tsx/StatisticheComponent"
import RespiriAdminComponent from "./backOfficeComponent.tsx/RespiriAdminComponent"
import LoadingSkeleton from "./common/LoadingSkeleton"
import { getSessionToken, getStoredUserId } from "../utils/session"

const BackOffice = () => {
  const [token, setToken] = useState<string | null>(null)
  const [myId, setMyId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = getSessionToken()
    const storedId = getStoredUserId()

    if (storedToken && storedId) {
      setToken(storedToken)
      setMyId(storedId)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    if (loading) return

    if (!token || !myId) {
      navigate("/login", { replace: true })
    }
  }, [loading, token, myId, navigate])

  if (loading || !token || !myId) {
    return <LoadingSkeleton className="mt-5 mx-auto w-100" lines={2} />
  }

  return (
    <Container className="my-5" role="main">
      <h1 className="text-white mynav rounded text-center mb-5 py-3">
        Backoffice Admin
      </h1>
      <h2 className="visually-hidden">
        Riepilogo attività di backoffice dell'admin
      </h2>
      <Row className="mb-5">
        <Col>
          <UserListComponent token={token} myId={myId} />
        </Col>
      </Row>
      <StatisticheComponent token={token} />
      <Row>
        <Col>
          <RespiriAdminComponent />
        </Col>
      </Row>
    </Container>
  )
}

export default BackOffice
