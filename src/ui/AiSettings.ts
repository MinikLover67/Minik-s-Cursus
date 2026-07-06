import type { CursusEditor } from '../editor/CursusEditor.ts'

export function setupAiSettings(editor: CursusEditor): void {
  const overlay = document.getElementById('ai-settings-overlay')
  const saveBtn = document.getElementById('btn-ai-save')
  const cancelBtn = document.getElementById('btn-ai-cancel')
  const backendSelect = document.getElementById('ai-backend-select') as HTMLSelectElement
  const checkBtn = document.getElementById('btn-check-ollama')

  backendSelect?.addEventListener('change', () => {
    document.getElementById('ollama-settings')?.classList.toggle('hidden', backendSelect.value !== 'ollama')
    document.getElementById('llamacpp-settings')?.classList.toggle('hidden', backendSelect.value !== 'llamacpp')
    document.getElementById('custom-settings')?.classList.toggle('hidden', backendSelect.value !== 'custom')
  })

  checkBtn?.addEventListener('click', async () => {
    const url = (document.getElementById('ollama-url') as HTMLInputElement)?.value
    const status = document.getElementById('ollama-status')
    if (status) status.textContent = 'Checking...'
    try {
      const result = await window.electronAPI.checkOllama(url)
      if (status) {
        status.textContent = result.running
          ? `Connected! ${result.models.length} models available.`
          : 'Ollama is not running. Please start Ollama first.'
        status.style.color = result.running ? 'var(--primary)' : 'var(--text-muted)'
      }
      const select = document.getElementById('ollama-model-select') as HTMLSelectElement
      if (select && result.models.length > 0) {
        select.innerHTML = ''
        for (const model of result.models) {
          const opt = document.createElement('option')
          opt.value = model
          opt.textContent = model
          select.appendChild(opt)
        }
      }
    } catch (err) {
      if (status) {
        status.textContent = 'Failed to connect.'
        status.style.color = 'var(--text-muted)'
      }
    }
  })

  saveBtn?.addEventListener('click', async () => {
    const backend = backendSelect?.value
    await window.electronAPI.setStore('aiBackend', backend)

    if (backend === 'ollama') {
      await window.electronAPI.setStore('ollamaBaseUrl', (document.getElementById('ollama-url') as HTMLInputElement)?.value || 'http://localhost:11434')
      await window.electronAPI.setStore('ollamaModel', (document.getElementById('ollama-model-select') as HTMLSelectElement)?.value || 'llama3.2:3b')
    } else if (backend === 'llamacpp') {
      await window.electronAPI.setStore('llamacppModelPath', (document.getElementById('llamacpp-path') as HTMLInputElement)?.value || '')
    } else if (backend === 'custom') {
      await window.electronAPI.setStore('customAiEndpoint', (document.getElementById('custom-endpoint') as HTMLInputElement)?.value || '')
      await window.electronAPI.setStore('customAiApiKey', (document.getElementById('custom-apikey') as HTMLInputElement)?.value || '')
      await window.electronAPI.setStore('customAiModel', (document.getElementById('custom-model') as HTMLInputElement)?.value || '')
    }

    overlay?.classList.add('hidden')
  })

  cancelBtn?.addEventListener('click', () => {
    overlay?.classList.add('hidden')
  })
}
