import type { APIRoute } from "astro"
import { getDb, type ContactMessage } from "@/lib/db"
import { isAdmin } from "@/lib/admin"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  if (!isAdmin(request)) {
    return new Response(JSON.stringify({ authorized: false }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }

  const db = getDb()
  const messages = db.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all() as ContactMessage[]
  const unread = messages.filter((m) => !m.read).length

  return new Response(JSON.stringify({ authorized: true, messages, unread }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAdmin(request)) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const body = await request.json()
    const { action, id } = body

    const db = getDb()

    if (action === "read-all") {
      db.prepare("UPDATE contacts SET read = 1 WHERE read = 0").run()
    } else if (action === "read" && id) {
      db.prepare("UPDATE contacts SET read = 1 WHERE id = ?").run(id)
    } else if (action === "delete" && id) {
      db.prepare("DELETE FROM contacts WHERE id = ?").run(id)
    }

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
