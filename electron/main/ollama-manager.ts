import { spawn, type ChildProcess } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

let child: ChildProcess | null = null
let starting = false

const OLLAMA_URL = 'http://localhost:11434'

function getOllamaPath(): string | null {
  const isWin = process.platform === 'win32'
  const name = isWin ? 'ollama.exe' : 'ollama'

  const pathDirs = (process.env.PATH || '').split(isWin ? ';' : ':')
  for (const dir of pathDirs) {
    try {
      const full = join(dir, name)
      if (existsSync(full)) return full
    } catch { }
  }

  const common: string[] = isWin
    ? [
        join(process.env.LOCALAPPDATA || '', 'Programs', 'Ollama', 'ollama.exe'),
        join(process.env.USERPROFILE || '', '.ollama', 'ollama.exe'),
        join(process.env.PROGRAMFILES || '', 'Ollama', 'ollama.exe'),
      ]
    : [
        '/usr/local/bin/ollama',
        '/usr/bin/ollama',
        '/opt/homebrew/bin/ollama',
      ]

  for (const p of common) {
    if (existsSync(p)) return p
  }

  return null
}

async function isOllamaRunning(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(1500) })
    return res.ok
  } catch {
    return false
  }
}

function waitForOllamaReady(timeoutMs = 30000): Promise<boolean> {
  const start = Date.now()
  return new Promise((resolve) => {
    const poll = async () => {
      if (await isOllamaRunning()) {
        resolve(true)
        return
      }
      if (Date.now() - start > timeoutMs) {
        resolve(false)
        return
      }
      setTimeout(poll, 500)
    }
    poll()
  })
}

export async function findOllama(): Promise<string | null> {
  return getOllamaPath()
}

export async function ensureOllama(): Promise<{ running: boolean; justStarted: boolean }> {
  if (await isOllamaRunning()) {
    return { running: true, justStarted: false }
  }
  if (starting) {
    const ok = await waitForOllamaReady()
    return { running: ok, justStarted: false }
  }

  const ollamaPath = getOllamaPath()
  if (!ollamaPath) {
    return { running: false, justStarted: false }
  }

  starting = true
  try {
    child = spawn(ollamaPath, ['serve'], {
      stdio: 'ignore',
      detached: false,
    })

    child.on('error', () => {
      child = null
      starting = false
    })

    child.on('exit', () => {
      child = null
      starting = false
    })

    const ok = await waitForOllamaReady()
    starting = false
    return { running: ok, justStarted: ok }
  } catch {
    starting = false
    return { running: false, justStarted: false }
  }
}

export function stopOllama(): void {
  if (child) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(child.pid), '/f', '/t'], { stdio: 'ignore' })
      } else {
        child.kill('SIGTERM')
      }
    } catch { }
    child = null
  }
  starting = false
}
