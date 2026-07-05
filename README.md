<div align="center">

# Cursus

### AI-Powered Rich Text Editor for Students & Teachers

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-33+-purple.svg)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

A modern, AI-powered desktop editor built for students and teachers. Write, edit, and manage documents with local AI assistance.

[Download](#downloads) • [Features](#features) • [Getting Started](#getting-started) • [AI Setup](#ai-setup) • [Contributing](#contributing)

</div>

---

## Downloads

| Platform | Link |
|----------|------|
| **Windows** | [Cursus-1.0.0-portable.exe](release/Cursus-1.0.0-portable.exe) (86 MB, portable) |
| **macOS** | Build from source (see below) |
| **Linux** | Build from source (see below) |

> **Portable** = No installation required. Just run the exe from anywhere.

---

## Features

### Rich Text Editing
- Headings (H1-H4), bold, italic, underline, strikethrough
- Bullet lists, ordered lists, task lists
- Blockquotes, code blocks with syntax highlighting
- Tables with resizable columns
- Links, images, video, file attachments
- Text alignment, font family, text color, highlight
- Subscript, superscript
- Undo/redo, drag & drop, paste support
- Markdown-friendly editing
- Full screen mode

### AI-Powered Writing
- **Continue writing** — Let AI finish your thoughts
- **Improve** — Enhance text quality and flow
- **Proofread** — Fix grammar and spelling
- **Translate** — Translate to multiple languages
- **Explain code** — Get code explanations
- **Add comments** — Auto-comment your code
- **Custom prompts** — Define your own AI actions
- **Local AI** — Works with Ollama (no internet needed)
- **Your API** — Bring your own API key

### Document Support
| Format | Read | Write | Edit |
|--------|------|-------|------|
| Markdown (.md) | ✅ | ✅ | ✅ |
| HTML (.html) | ✅ | ✅ | ✅ |
| Plain Text (.txt) | ✅ | ✅ | ✅ |
| Word (.docx) | ✅ | ✅ | ✅ |
| PDF (.pdf) | ✅ | ✅ | ✅ |
| Excel (.xlsx) | ✅ | ✅ | ✅ |
| PowerPoint (.pptx) | — | ✅ | — |
| CSV (.csv) | ✅ | ✅ | ✅ |
| JSON (.json) | ✅ | ✅ | ✅ |

### User Experience
- 🌓 Light and dark themes
- 📖 Welcome guide for first-time users
- 📁 Recent files sidebar
- ⌨️ Keyboard shortcuts
- 🖱️ Drag and drop files
- 📋 Paste images directly
- 📊 Status bar with word count
- 🌍 7 languages (EN, ES, FR, DE, ZH, JA, KO)

---

## Getting Started

### Prerequisites
- [Node.js 18+](https://nodejs.org/) (recommended: 20 LTS)
- npm 9+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cursus.git
cd cursus

# Install dependencies
npm install

# Start development
npm run dev
```

### Build & Package

```bash
# Build the app
npm run build

# Create portable exe (Windows)
npx electron-builder --win portable

# Create DMG (macOS)
npx electron-builder --mac

# Create AppImage (Linux)
npx electron-builder --linux
```

---

## AI Setup

### Option 1: Ollama (Recommended - Local, Free)

1. Install [Ollama](https://ollama.ai)
2. Pull a model:
   ```bash
   ollama pull llama3.2:3b
   ```
3. Open Cursus → **AI** → **AI Settings**
4. Select **Ollama** as backend
5. Click **Check** to verify connection

### Option 2: Custom API

1. Open Cursus → **AI** → **AI Settings**
2. Select **Custom API** as backend
3. Enter your API endpoint and key
4. Enter the model name

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New document |
| `Ctrl+O` | Open file |
| `Ctrl+S` | Save |
| `Ctrl+Shift+S` | Save as |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+K` | Insert link |
| `F11` | Toggle fullscreen |

---

## Project Structure

```
Cursus/
├── electron/           # Electron main process
│   ├── main/          # App entry, window, menu
│   ├── preload/       # Context bridge API
│   └── shared/        # Shared types
├── src/               # Renderer process
│   ├── editor/        # Tiptap editor core
│   ├── ai/            # AI integration UI
│   ├── ui/            # UI components
│   ├── i18n/          # Internationalization
│   ├── styles/        # CSS styles & themes
│   └── lib/           # Utilities
├── build/             # Build assets
└── .github/           # GitHub Actions CI
```

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Desktop | Electron 33+ |
| Editor | Tiptap (ProseMirror) |
| Language | TypeScript |
| Bundler | Vite + esbuild |
| AI | Ollama / Custom API |
| PDF | pdf-lib + pdf.js |
| DOCX | mammoth + docx |
| PPTX | pptxgenjs |

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Built on [AiEditor](https://github.com/aieditor-team/aieditor) (Tiptap-based)
- Powered by [Ollama](https://ollama.ai) for local AI
- Uses [Electron](https://electronjs.org) for desktop
