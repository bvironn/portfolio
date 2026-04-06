import type { APIRoute } from "astro"
import { compareSync } from "bcryptjs"

import { getSessionCookie, getLogoutCookie } from "@/lib/admin"
import { authLimiter, getClientIp } from "@/lib/rateLimiter"

export const prerender = false

const ADMIN_HASH = import.meta.env.ADMIN_PASSWORD_HASH || null

export const POST: APIRoute = async ({ request }) => {
  if (ADMIN_HASH === null) {
    return new Response(JSON.stringify({ success: false, error: "Server misconfiguration" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const body = await request.json()

  if (body.action === "logout") {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": getLogoutCookie(),
      },
    })
  }

  const ip = getClientIp(request)
  const { allowed } = authLimiter.check(ip)

  if (!allowed) {
    return new Response(JSON.stringify({ success: false, error: "Too many attempts. Try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { password } = body

  if (!compareSync(password, ADMIN_HASH)) {
    return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  authLimiter.reset(ip)

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": getSessionCookie(),
    },
  })
}
