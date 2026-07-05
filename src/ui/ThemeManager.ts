export function setupTheme(): void {
  const btn = document.getElementById('btn-theme')
  btn?.addEventListener('click', async () => {
    const current = await window.electronAPI.getStore('theme')
    const next = current === 'dark' ? 'light' : 'dark'
    document.body.className = `theme-${next}`
    await window.electronAPI.setStore('theme', next)
  })
}
