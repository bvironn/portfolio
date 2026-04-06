class RateLimiter {
  private store = new Map<string, { count: number; windowStart: number }>()
  private limit: number
  private windowMs: number

  constructor({ limit, windowMs }: { limit: number; windowMs: number }) {
    this.limit = limit
    this.windowMs = windowMs
  }

  check(key: string): { allowed: boolean; remaining: number } {
    const now = Date.now()

    for (const [k, entry] of this.store.entries()) {
      if (now - entry.windowStart > this.windowMs) {
        this.store.delete(k)
      }
    }

    const entry = this.store.get(key)

    if (!entry || now - entry.windowStart > this.windowMs) {
      this.store.set(key, { count: 1, windowStart: now })
      return { allowed: true, remaining: this.limit - 1 }
    }

    if (entry.count >= this.limit) {
      return { allowed: false, remaining: 0 }
    }

    entry.count++
    return { allowed: true, remaining: this.limit - entry.count }
  }

  reset(key: string): void {
    this.store.delete(key)
  }
}

export const authLimiter = new RateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 })
export const contactLimiter = new RateLimiter({ limit: 10, windowMs: 60 * 60 * 1000 })

export const getClientIp = (request: Request): string => {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  )
}
