export interface IPCChannels {
  'file:open': { request: void; response: { path: string; content: string; type: string } | null }
  'file:save': { request: { path: string; content: string; format: string }; response: boolean }
  'file:save-as': { request: { content: string; format: string }; response: string | null }
  'file:read': { request: string; response: string }
  'file:write': { request: { path: string; content: string }; response: boolean }
  'file:exists': { request: string; response: boolean }
  'file:get-recent': { request: void; response: string[] }
  'file:add-recent': { request: string; response: void }

  'dialog:open-file': { request: { filters?: { name: string; extensions: string[] }[] }; response: string | null }
  'dialog:save-file': { request: { defaultName?: string; filters?: { name: string; extensions: string[] }[] }; response: string | null }
  'dialog:open-directory': { request: void; response: string | null }

  'ai:check-ollama': { request: void; response: { running: boolean; models: string[] } }
  'ai:ollama-generate': { request: { model: string; prompt: string; baseUrl?: string }; response: { stream: AsyncIterable<string> } }
  'ai:ollama-models': { request: { baseUrl?: string }; response: string[] }
  'ai:ollama-pull': { request: { model: string; baseUrl?: string }; response: void }

  'app:get-path': { request: { name: string }; response: string }
  'app:get-store': { request: { key: string }; response: unknown }
  'app:set-store': { request: { key: string; value: unknown }; response: void }
  'app:get-version': { request: void; response: string }
}

export interface FileOpenResult {
  path: string
  content: string
  type: 'markdown' | 'html' | 'text' | 'docx' | 'pdf' | 'xlsx' | 'pptx' | 'csv' | 'json' | 'unknown'
}
