import type { APIRoute } from "astro"

export const prerender = false

const PUBKEY = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG6Ir07yU6hob1G1RSzcWGKU4wObxJf/wdauPHdirq6W admin@devhome\n"

export const GET: APIRoute = () => {
  return new Response(PUBKEY, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
