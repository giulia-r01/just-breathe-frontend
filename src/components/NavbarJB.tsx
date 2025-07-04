import { Container, Navbar, Nav } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

const NavbarJB = function () {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const ruolo = localStorage.getItem("ruolo")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("ruolo")
    navigate("/")
  }

  return (
    <header>
      <Navbar expand="lg" className="mynav" data-bs-theme="dark">
        <Container>
          <Link to={token ? "/index" : "/"}>
            🌿 <em>Just Breathe</em>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link
                className={
                  location.pathname === "/index"
                    ? "nav-link active"
                    : "nav-link"
                }
                to="/index"
              >
                Dashboard
              </Link>
            </Nav>
            <Nav>
              <Link className="nav-link" to="/diario">
                Diario
              </Link>
            </Nav>
            <Nav>
              <Link className="nav-link" to="/calendario">
                Calendario
              </Link>
            </Nav>
            <Nav>
              <Link className="nav-link" to="/mood">
                Mood
              </Link>
            </Nav>
            <Nav>
              <Link className="nav-link" to="/eventi">
                Eventi
              </Link>
            </Nav>
            <Nav>
              {ruolo === "ADMIN" && (
                <Link className="nav-link" to="/backOffice">
                  Backoffice
                </Link>
              )}
            </Nav>
            <Nav>
              {token && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default NavbarJB
