import type { APIRoute } from "astro"

import { getDb } from "@/lib/db"
import { contactLimiter, getClientIp } from "@/lib/rateLimiter"

export const prerender = false

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const POST: APIRoute = async ({ request }) => {
  try {
    const siteUrl = import.meta.env.SITE_URL

    if (siteUrl) {
      const origin = request.headers.get("origin")
      const referer = request.headers.get("referer")

      if (origin) {
        if (origin !== siteUrl) {
          return new Response(JSON.stringify({ success: false, error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          })
        }
      } else if (referer) {
        if (!referer.startsWith(siteUrl)) {
          return new Response(JSON.stringify({ success: false, error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          })
        }
      }
    }

    const ip = getClientIp(request)
    const { allowed } = contactLimiter.check(ip)

    if (!allowed) {
      return new Response(JSON.stringify({ success: false, error: "Too many messages. Try again later." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      })
    }

    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Todos los campos son requeridos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (typeof name !== "string" || name.length > 100 ||
        typeof email !== "string" || email.length > 200 || !EMAIL_RE.test(email) ||
        typeof message !== "string" || message.length > 2000) {
      return new Response(JSON.stringify({ error: "Datos invalidos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const db = getDb()
    db.prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)").run(
      name.trim(),
      email.trim(),
      message.trim()
    )

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
