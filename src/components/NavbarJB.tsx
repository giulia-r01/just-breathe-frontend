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
      <Navbar expand="lg" className="mynav" data-bs-theme="dark" fixed="top">
        <Container>
          <Link to={token ? "/index" : "/"} className="ms-0">
            <img
              alt="logo Just Breathe"
              src="Just Breathe-Logo.png"
              width={100}
            />
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="w-100 d-flex justify-content-between">
              <Nav>
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
                <Link className="nav-link" to="/diario">
                  Diario
                </Link>
                <Link className="nav-link" to="/calendario">
                  Calendario
                </Link>
                <Link className="nav-link" to="/mood">
                  Mood
                </Link>
                <Link className="nav-link" to="/eventi">
                  Eventi
                </Link>
                <Link className="nav-link" to="/respirazioni">
                  Respirazioni guidate
                </Link>
              </Nav>

              <Nav>
                {ruolo === "ADMIN" && (
                  <Link className="nav-link" to="/backOffice">
                    Backoffice
                  </Link>
                )}
                {!token && (
                  <>
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                    <Link className="nav-link" to="/register">
                      Registrati
                    </Link>
                  </>
                )}
                {token && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default NavbarJB
