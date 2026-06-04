import { clearStoredSession } from "./session"

const SESSION_EXPIRED_MESSAGE_KEY = "sessionExpiredMessage"

const hasAuthorizationHeader = (headers?: HeadersInit): boolean => {
  if (!headers) return false

  if (headers instanceof Headers) {
    return headers.has("Authorization")
  }

  if (Array.isArray(headers)) {
    return headers.some(([key]) => key.toLowerCase() === "authorization")
  }

  return Object.keys(headers).some((key) => key.toLowerCase() === "authorization")
}

const parseJwtPayload = (token: string): { exp?: number } | null => {
  try {
    const payloadBase64 = token.split(".")[1]
    if (!payloadBase64) return null

    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
    const decoded = atob(normalized)

    return JSON.parse(decoded) as { exp?: number }
  } catch {
    return null
  }
}

const setExpiredMessage = () => {
  if (!sessionStorage.getItem(SESSION_EXPIRED_MESSAGE_KEY)) {
    sessionStorage.setItem(
      SESSION_EXPIRED_MESSAGE_KEY,
      "Sessione scaduta, effettua di nuovo il login."
    )
  }
}

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login")
  }
}

export const clearSessionAndRedirectToLoginIfNeeded = (
  navigate?: (to: string, options?: { replace?: boolean }) => void,
  currentPath?: string
) => {
  clearStoredSession()
  setExpiredMessage()

  const path = currentPath ?? window.location.pathname

  if (path === "/login") return

  if (navigate) {
    navigate("/login", { replace: true })
    return
  }

  redirectToLogin()
}

export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwtPayload(token)
  const exp = payload?.exp

  if (!exp) return false

  const nowInSeconds = Math.floor(Date.now() / 1000)
  return nowInSeconds >= exp
}

export const setupAuthInterceptor = () => {
  const originalFetch = globalThis.fetch.bind(globalThis)

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init)

    if (response.status === 401 && hasAuthorizationHeader(init?.headers)) {
      clearSessionAndRedirectToLoginIfNeeded()
    }

    return response
  }
}

export { SESSION_EXPIRED_MESSAGE_KEY }
