export const getSessionToken = () => localStorage.getItem("token")

export const getStoredRole = () => localStorage.getItem("ruolo")

export const getStoredUserId = () => {
  const rawValue = localStorage.getItem("userId")

  if (!rawValue) return null

  const parsedValue = Number.parseInt(rawValue, 10)
  return Number.isNaN(parsedValue) ? null : parsedValue
}

export const getStoredProfileImage = () => localStorage.getItem("imgProfilo") || "user.svg"

export const clearStoredSession = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("ruolo")
  localStorage.removeItem("imgProfilo")
  localStorage.removeItem("userId")
}
