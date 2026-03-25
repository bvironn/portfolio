import Database from "better-sqlite3"
import { join } from "path"
import { mkdirSync, existsSync } from "fs"

const DB_PATH = join(process.cwd(), "data", "portfolio.db")

let db: Database.Database | null = null

export const getDb = () => {
  if (!db) {
    const dir = join(process.cwd(), "data")
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

    db = new Database(DB_PATH)
    db.pragma("journal_mode = WAL")
    db.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `)
  }
  return db
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  read: number
  created_at: string
}
