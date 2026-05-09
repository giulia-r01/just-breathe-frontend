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

export const setupAuthInterceptor = () => {
  const originalFetch = globalThis.fetch.bind(globalThis)

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init)

    if (response.status === 401 && hasAuthorizationHeader(init?.headers)) {
      localStorage.clear()
      sessionStorage.setItem(
        SESSION_EXPIRED_MESSAGE_KEY,
        "Sessione scaduta, effettua di nuovo il login."
      )

      if (window.location.pathname !== "/login") {
        window.location.assign("/login")
      }
    }

    return response
  }
}

export { SESSION_EXPIRED_MESSAGE_KEY }
