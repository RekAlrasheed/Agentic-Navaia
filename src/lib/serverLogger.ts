import { promises as fs } from 'fs'
import path from 'path'

type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  source: string
  level: LogLevel
  message: string
  meta?: any
}

const logDir = path.join(process.cwd(), 'logs')
const logFile = path.join(logDir, 'elevenlabs.log')

async function ensureLogDir() {
  try {
    await fs.mkdir(logDir, { recursive: true })
  } catch {
    // ignore
  }
}

export async function logEvent(source: string, level: LogLevel, message: string, meta?: any) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    source,
    level,
    message,
    meta,
  }
  try {
    await ensureLogDir()
    await fs.appendFile(logFile, JSON.stringify(entry) + '\n', 'utf8')
  } catch (err) {
    // As a fallback, log to console to avoid swallowing errors silently
    console.error('[logger-fallback]', entry, err)
  }
}

export function getLogFilePath() {
  return logFile
}
