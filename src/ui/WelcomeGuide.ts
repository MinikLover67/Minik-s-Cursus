export function setupWelcomeGuide(): void {
  const overlay = document.getElementById('welcome-overlay')
  const startBtn = document.getElementById('btn-welcome-start')
  const dontShow = document.getElementById('dont-show-again') as HTMLInputElement

  startBtn?.addEventListener('click', async () => {
    if (dontShow?.checked) {
      await window.electronAPI.setStore('welcomeShown', true)
    }
    overlay?.classList.add('hidden')
  })
}
