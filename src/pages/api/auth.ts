import type { APIRoute } from "astro"
import { compareSync } from "bcryptjs"
import { getSessionCookie, getLogoutCookie } from "@/lib/admin"

export const prerender = false

const ADMIN_HASH = import.meta.env.ADMIN_PASSWORD_HASH
  ?? "$2b$10$ZElZWKBriRcZjrCO4nNYaeFgrKHwxUUWl3NtYjFqyP3B8Az1Uo3F."

export const POST: APIRoute = async ({ request }) => {
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

  const { password } = body

  if (!compareSync(password, ADMIN_HASH)) {
    return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": getSessionCookie(),
    },
  })
}
