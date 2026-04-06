const ADMIN_TOKEN = import.meta.env.ADMIN_SESSION_TOKEN || (() => {
  const token = crypto.randomUUID()
  console.warn("[admin] ADMIN_SESSION_TOKEN not set — using ephemeral token")
  return token
})()

export const isAdmin = (request: Request): boolean => {
  const cookie = request.headers.get("cookie") ?? ""
  return cookie.split(";").some((c) => c.trim() === `admin_session=${ADMIN_TOKEN}`)
}

export const getSessionCookie = () =>
  `admin_session=${ADMIN_TOKEN}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=604800`

export const getLogoutCookie = () =>
  `admin_session=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0`
