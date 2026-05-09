import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import UserListComponent from "./backOfficeComponent.tsx/UserListComponent"
import StatisticheComponent from "./backOfficeComponent.tsx/StatisticheComponent"
import RespiriAdminComponent from "./backOfficeComponent.tsx/RespiriAdminComponent"
import LoadingSkeleton from "./common/LoadingSkeleton"

const BackOffice = () => {
  const [token, setToken] = useState<string | null>(null)
  const [myId, setMyId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedId = localStorage.getItem("userId")

    if (storedToken && storedId) {
      setToken(storedToken)
      setMyId(parseInt(storedId))
    }

    setLoading(false)
  }, [])

  if (loading) {
    return <LoadingSkeleton className="mt-5 mx-auto w-100" lines={2} />
  }

  if (!token || !myId) {
    return (
      <p className="bg-white rounded p2 text-center mt-5 text-danger fw-bold">
        Accesso non autorizzato. Effettua il login.
      </p>
    )
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
