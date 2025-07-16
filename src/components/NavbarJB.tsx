import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

const NavbarJB = function () {
  const navigate = useNavigate()
  const location = useLocation()

  const [token, setToken] = useState<string | null>(null)
  const [ruolo, setRuolo] = useState<string | null>(null)
  const [imgProfilo, setImgProfilo] = useState<string>("user.svg")
  const [expanded, setExpanded] = useState(false)

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
      <Navbar
        expand="lg"
        className="mynav"
        data-bs-theme="dark"
        fixed="top"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <Link
            aria-label={
              token
                ? "Just Breathe - Vai alla dashboard"
                : "Just Breate - Accedi o iscriviti"
            }
            to={token ? "/index" : "/"}
            className="ms-0"
            onClick={() => setExpanded(false)}
          >
            <img
              alt="logo Just Breathe"
              src="Just Breathe-Logo.png"
              width={100}
            />
          </Link>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            aria-label="Apri il menu di navigazione"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="w-100 d-flex justify-content-between">
              <Nav className="mt-2">
                {token && (
                  <>
                    <Link
                      aria-current={
                        location.pathname === "/diario" ? "page" : undefined
                      }
                      aria-label="Diario - Scrivi il tuo diario"
                      className={`nav-link ${
                        location.pathname === "/diario"
                          ? "text-custom-active fw-bold"
                          : "text-white"
                      }`}
                      to="/diario"
                      onClick={() => setExpanded(false)}
                    >
                      Diario
                    </Link>
                    <Link
                      aria-current={
                        location.pathname === "/todolist" ? "page" : undefined
                      }
                      aria-label="ToDo List - Calendario - Organizza il tuo tempo"
                      className={`nav-link ${
                        location.pathname === "/todolist"
                          ? "text-custom-active fw-bold"
                          : "text-white"
                      }`}
                      to="/todolist"
                      onClick={() => setExpanded(false)}
                    >
                      ToDo List - Calendario
                    </Link>
                    <Link
                      aria-current={
                        location.pathname === "/mood" ? "page" : undefined
                      }
                      aria-label="Mood - Crea la tua playlist in base al tuo mood"
                      className={`nav-link ${
                        location.pathname === "/mood"
                          ? "text-custom-active fw-bold"
                          : "text-white"
                      }`}
                      to="/mood"
                      onClick={() => setExpanded(false)}
                    >
                      Mood
                    </Link>
                    <Link
                      aria-current={
                        location.pathname === "/eventi" ? "page" : undefined
                      }
                      aria-label="Eventi - Scopri gli eventi nella tua città"
                      className={`nav-link ${
                        location.pathname === "/eventi"
                          ? "text-custom-active fw-bold"
                          : "text-white"
                      }`}
                      to="/eventi"
                      onClick={() => setExpanded(false)}
                    >
                      Eventi
                    </Link>
                    <Link
                      aria-current={
                        location.pathname === "/respirazioni"
                          ? "page"
                          : undefined
                      }
                      aria-label="Respirazioni guidate - Scegli la respirazione che più fa per te"
                      className={`nav-link ${
                        location.pathname === "/respirazioni"
                          ? "text-custom-active fw-bold"
                          : "text-white"
                      }`}
                      to="/respirazioni"
                      onClick={() => setExpanded(false)}
                    >
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
                    <NavDropdown.Item
                      as={Link}
                      to="/profilo"
                      onClick={() => setExpanded(false)}
                      aria-label="Profilo - Vai alle impostazioni del tuo profilo"
                    >
                      Profilo
                    </NavDropdown.Item>

                    {ruolo === "ADMIN" && (
                      <NavDropdown.Item
                        aria-current={
                          location.pathname === "/backoffice"
                            ? "page"
                            : undefined
                        }
                        as={Link}
                        to="/backoffice"
                        onClick={() => setExpanded(false)}
                        aria-label="Backoffice - Vai alla sezione dedicata all'admin"
                      >
                        Backoffice
                      </NavDropdown.Item>
                    )}

                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={handleLogout}
                      aria-label="Logout - esci dal sito"
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <>
                    <Link
                      aria-current={
                        location.pathname === "/login" ? "page" : undefined
                      }
                      className="nav-link mt-2"
                      to="/login"
                      onClick={() => setExpanded(false)}
                      aria-label="Login - accedi al sito"
                    >
                      Login
                    </Link>
                    <Link
                      aria-current={
                        location.pathname === "/register" ? "page" : undefined
                      }
                      className="nav-link mt-2"
                      to="/register"
                      onClick={() => setExpanded(false)}
                      aria-label="Registrati - registrati al sito"
                    >
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
