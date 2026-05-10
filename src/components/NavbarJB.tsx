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
        className="jb-navbar"
        fixed="top"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <Link
            aria-label={
              token
                ? "Just Breathe - Vai alla dashboard"
                : "Just Breathe - Accedi o iscriviti"
            }
            to={token ? "/index" : "/"}
            className="ms-0"
            onClick={() => setExpanded(false)}
          >
            <img
              alt="logo Just Breathe"
              src="/jb-logo.svg"
              width={52}
              height={52}
            />
          </Link>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            aria-label="Apri il menu di navigazione"
          />

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-lg-end">
            <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center ms-lg-auto gap-2">
              <Nav className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 me-lg-1">
                {token && (
                  <>
                    <Link
                      aria-current={
                        location.pathname === "/diario" ? "page" : undefined
                      }
                      aria-label="Diario - Scrivi il tuo diario"
                      className={`nav-link text-nowrap ${location.pathname === "/diario" ? "text-custom-active fw-bold" : ""}`}
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
                      className={`nav-link text-nowrap ${location.pathname === "/todolist" ? "text-custom-active fw-bold" : ""}`}
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
                      className={`nav-link text-nowrap ${location.pathname === "/mood" ? "text-custom-active fw-bold" : ""}`}
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
                      className={`nav-link text-nowrap ${location.pathname === "/eventi" ? "text-custom-active fw-bold" : ""}`}
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
                      aria-label="Respirazioni guidate - Scegli la respirazione più adatta a te"
                      className={`nav-link text-nowrap ${location.pathname === "/respirazioni" ? "text-custom-active fw-bold" : ""}`}
                      to="/respirazioni"
                      onClick={() => setExpanded(false)}
                    >
                      Respirazioni guidate
                    </Link>
                  </>
                )}
              </Nav>

              <Nav className="d-flex flex-row align-items-center justify-content-between justify-content-lg-end w-100 w-lg-auto">
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
                    className="jb-dropdown"
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
                      onClick={() => {
                        handleLogout()
                        setExpanded(false)
                      }}
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
