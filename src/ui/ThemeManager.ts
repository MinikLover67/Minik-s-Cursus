export function setupTheme(): void {
  const btn = document.getElementById('btn-theme')
  btn?.addEventListener('click', async () => {
    const current = document.body.className.includes('dark') ? 'dark' : 'light'
    const next = current === 'dark' ? 'light' : 'dark'
    document.body.className = `theme-${next}`
    await window.electronAPI.setStore('theme', next)
  })
}
