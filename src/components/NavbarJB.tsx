import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

const NavbarJB = function () {
  const navigate = useNavigate()
  const location = useLocation()

  const [token, setToken] = useState<string | null>(null)
  const [ruolo, setRuolo] = useState<string | null>(null)
  const [imgProfilo, setImgProfilo] = useState<string>("user.svg")

  useEffect(() => {
    const t = localStorage.getItem("token")
    const r = localStorage.getItem("ruolo")
    const img = localStorage.getItem("imgProfilo") || "user.svg"

    setToken(t)
    setRuolo(r)
    setImgProfilo(img)
  }, [location])

  const handleLogout = () => {
    localStorage.clear()
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
              <Nav className="mt-2">
                {token && (
                  <>
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
                    <Link className="nav-link" to="/todolist">
                      ToDo List - Calendario
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
                  </>
                )}
              </Nav>

              <Nav>
                {token ? (
                  <NavDropdown
                    title={
                      <img
                        src={imgProfilo}
                        alt="Immagine del profilo"
                        className="imgProfiloNav my-0 rounded-circle"
                      />
                    }
                    id="dropdown-profilo"
                    align="end"
                    menuVariant="dark"
                  >
                    <NavDropdown.Item as={Link} to="/profilo">
                      Profilo
                    </NavDropdown.Item>

                    {ruolo === "ADMIN" && (
                      <NavDropdown.Item as={Link} to="/backOffice">
                        Backoffice
                      </NavDropdown.Item>
                    )}

                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <>
                    <Link className="nav-link mt-2" to="/login">
                      Login
                    </Link>
                    <Link className="nav-link mt-2" to="/register">
                      Registrati
                    </Link>
                  </>
                )}
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default NavbarJB
