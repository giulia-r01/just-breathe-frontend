import { getSessionToken } from "./session"

type ApiFetchOptions = RequestInit & {
  auth?: boolean
  token?: string | null
}

const API_URL = import.meta.env.VITE_API_URL

export const apiUrl = (path: string) => `${API_URL}${path}`

export const apiFetch = (path: string, options: ApiFetchOptions = {}) => {
  const { auth = false, token, headers, ...rest } = options
  const resolvedHeaders = new Headers(headers)

  if (auth) {
    const resolvedToken = token ?? getSessionToken()

    if (resolvedToken) {
      resolvedHeaders.set("Authorization", `Bearer ${resolvedToken}`)
    }
  }

  return fetch(apiUrl(path), {
    ...rest,
    headers: resolvedHeaders,
  })
}
