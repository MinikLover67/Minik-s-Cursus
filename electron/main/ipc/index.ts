import { registerFileIpc } from './file.ipc.ts'
import { registerAiIpc } from './ai.ipc.ts'
import { registerAppIpc } from './app.ipc.ts'

export function registerAllIpc(): void {
  registerFileIpc()
  registerAiIpc()
  registerAppIpc()
}
