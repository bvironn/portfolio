import { useState, useEffect, useRef } from "react"

interface Message {
  id: number
  name: string
  email: string
  message: string
  read: number
  created_at: string
}

export const NotificationBell = () => {
  const [authorized, setAuthorized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      if (data.authorized) {
        setAuthorized(true)
        setMessages(data.messages)
        setUnread(data.unread)
      }
    } catch {
      // not admin or error
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read-all" }),
    })
    fetchNotifications()
  }

  const markRead = async (id: number) => {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read", id }),
    })
    fetchNotifications()
  }

  const deleteMessage = async (id: number) => {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    })
    fetchNotifications()
  }

  if (!authorized) return null

  return (
    <div ref={ref} className="fixed top-4 right-4 z-[60]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-lg border border-border bg-card p-2 transition-colors hover:border-foreground/20 cursor-pointer"
      >
        <svg
          className="size-4 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="font-mono text-xs text-muted-foreground">
              notificaciones ({messages.length})
            </span>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="font-mono text-[10px] text-muted-foreground/60 transition-colors hover:text-foreground cursor-pointer"
              >
                marcar todo leido
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-4 text-center font-mono text-xs text-muted-foreground/50">
                sin mensajes
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 border-b border-border p-3 last:border-b-0 ${
                    !msg.read ? "bg-muted/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {!msg.read && (
                        <span className="size-1.5 rounded-full bg-red-500" />
                      )}
                      <span className="font-mono text-xs font-medium text-foreground">
                        {msg.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {new Date(msg.created_at + "Z").toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {msg.email}
                  </span>
                  <p className="text-xs text-foreground/70">{msg.message}</p>
                  <div className="flex items-center gap-2 pt-1">
                    {!msg.read && (
                      <button
                        type="button"
                        onClick={() => markRead(msg.id)}
                        className="font-mono text-[10px] text-muted-foreground/50 transition-colors hover:text-foreground cursor-pointer"
                      >
                        leido
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteMessage(msg.id)}
                      className="font-mono text-[10px] text-muted-foreground/50 transition-colors hover:text-red-400 cursor-pointer"
                    >
                      eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
