export async function setupTheme(): Promise<void> {
  const btn = document.getElementById('btn-theme')
  const savedTheme = await window.electronAPI.getStore('theme')
  document.body.className = `theme-${savedTheme || 'light'}`

  btn?.addEventListener('click', async () => {
    const current = document.body.className.includes('dark') ? 'dark' : 'light'
    const next = current === 'dark' ? 'light' : 'dark'
    document.body.className = `theme-${next}`
    await window.electronAPI.setStore('theme', next)
  })
}
