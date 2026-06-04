import type { ReactNode } from "react"
import { Col, Container, Row } from "react-bootstrap"

interface AuthFrameProps {
  title: string
  subtitle?: ReactNode
  children: ReactNode
}

const AuthFrame = ({ title, subtitle, children }: AuthFrameProps) => {
  return (
    <Container className="jb-auth-shell mt-4" role="main">
      <Row className="justify-content-center px-4">
        <Col
          md={6}
          lg={5}
          xl={4}
          className="jb-surface jb-auth-card jb-auth-frame py-4 my-4 rounded"
        >
          <h1 className="jb-auth-title">{title}</h1>
          {subtitle ? <div className="jb-auth-subtitle">{subtitle}</div> : null}
          {children}
        </Col>
      </Row>
    </Container>
  )
}

export default AuthFrame
