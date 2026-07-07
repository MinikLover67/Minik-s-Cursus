<div align="center">

# Cursus

### Rich Text Editor for Students & Teachers

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-33+-purple.svg)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

A modern desktop editor for writing, editing, and managing documents.

> **Beta** — This is a development preview. Some features may be incomplete. Bugs and issues are being actively fixed.

</div>

---

## Table of Contents

- [Downloads](#downloads)
- [Features](#features)
- [Quick Start](#quick-start)
- [Document Formats](#document-formats)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Settings](#settings)
- [Development](#development)
- [Building & Packaging](#building--packaging)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Downloads

| File | Type | Size | Description |
|------|------|------|-------------|
| [Cursus Setup 1.0.0-beta.1.exe](https://github.com/MinikLover67/Minik-s-Cursus/releases/latest) | **Installer** (NSIS) | ~91 MB | Full installer, registers file associations, adds start menu & desktop shortcuts |
| [Cursus-1.0.0-beta.1-portable.exe](https://github.com/MinikLover67/Minik-s-Cursus/releases/latest) | **Portable** | ~91 MB | No installation needed, run from USB or anywhere |

**Which one should I download?**
- **Installer** — If you want Cursus to appear in the "Open with" dialog for PDF/DOCX/etc. files. Requires admin rights to install.
- **Portable** — If you want to run Cursus from a USB drive or don't have admin rights. No file associations.

> **Check for Updates** — Open Cursus and click **Check for Updates** on the home screen to see if a newer version is available.

---

## Features

### Rich Text Editing
- Headings (H1–H4), bold, italic, underline, strikethrough
- Subscript, superscript, inline code
- Bullet lists, ordered lists, task lists (checkboxes)
- Blockquotes, code blocks with syntax highlighting (40+ languages)
- Tables with resizable columns
- Links, images (drag & drop or paste), horizontal rules
- Text alignment (left, center, right)
- Font family selection, text color, highlight (multicolor)
- Undo / redo history, full screen mode
- Slash commands — type `/` for quick formatting

### Document Support
| Format | Read | Write / Export | Edit In-Place |
|--------|------|----------------|---------------|
| Markdown (.md) | ✅ Full | ✅ | ✅ |
| HTML (.html, .htm) | ✅ Full | ✅ | ✅ |
| Plain Text (.txt) | ✅ | ✅ | ✅ |
| Word (.docx) | ✅ Converted | ✅ | ✅ After conversion |
| PDF (.pdf) | ✅ Imported | ✅ Export | ✅ Basic |
| Excel (.xlsx, .xls) | ✅ As table | ✅ Export | ✅ |
| PowerPoint (.pptx) | ✅ | ✅ | — |
| CSV (.csv) | ✅ | ✅ | ✅ |
| JSON (.json) | ✅ | ✅ | ✅ |

### User Experience
- **Animated loading screen** — Polished startup animation with logo pulse + progress bar
- **Home screen** — New Document / Open File cards, recent files, update checker
- **Light & Dark themes** — Toggle anytime via button or `Ctrl+Shift+T`
- **Welcome guide** — First-run overlay shown after loading screen
- **Recent files** — Quick access from sidebar or home screen
- **Autosave** — Every 30 seconds when a file is open
- **Drag & drop** — Open files or insert images by dragging
- **Paste images** — Paste from clipboard directly into the editor
- **Word count** — Live word count in status bar
- **Slash commands** — Type `/` in the editor for a command palette (headings, formatting, table, image, link, etc.)

### Coming Soon (AI Features)
AI-powered writing assistance (autocomplete, rephrase, proofread, translate, etc.) is temporarily disabled and will be re-added in a future release. If you'd like to test the AI features, download an older beta release from the [Releases](https://github.com/MinikLover67/Minik-s-Cursus/releases) page.

---

## Quick Start

### Running the Portable Version
1. Download `Cursus-1.0.0-beta.1-portable.exe` from [Downloads](#downloads)
2. Double-click to run — no installation needed
3. Watch the animated loading screen, then click **New Document** to start writing

### Installing via Setup
1. Download `Cursus Setup 1.0.0-beta.1.exe` from [Downloads](#downloads)
2. Run the installer (requires admin rights)
3. Launch Cursus from Start Menu or desktop shortcut
4. After installation, you can right-click any `.md` or `.pdf` file → **Open with** → **Cursus**

### First Steps
1. **Loading Screen** — Appears briefly with a pulsing logo and progress bar
2. **Home Screen** — Shows New Document and Open File cards, recent files, and footer links
3. **Create a new document** — Click "New Document" or press `Ctrl+N`
4. **Open a file** — Click "Open File" or press `Ctrl+O`
5. **Format text** — Use the toolbar or type `/` for slash commands
6. **Save** — Press `Ctrl+S` or use File → Save
7. **Autosave** — Enabled automatically after the first save
8. **Switch themes** — Click the sun/moon icon in the status bar or press `Ctrl+Shift+T`

---

## Document Formats

| Format | Reading | Writing | Editing |
|--------|---------|---------|---------|
| **.md** | Read as text, displayed as rich text | Converted from HTML to Markdown | Full rich text |
| **.html** | Read as HTML | Written as HTML | Full rich text |
| **.txt** | Read as plain text | Written as text | Full rich text |
| **.docx** | Converted via mammoth | Built via custom XML + JSZip | After conversion |
| **.pdf** | Extracted via pdf-lib | Generated via pdf-lib | Basic text editing |
| **.xlsx** | Read as CSV | Written as CSV | As plain text table |
| **.pptx** | Read as text | Generated via pptxgenjs | — |
| **.csv** | Read as CSV | Written as CSV | Full rich text |
| **.json** | Read as JSON | Written as JSON | Full rich text |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New document |
| `Ctrl+O` | Open file |
| `Ctrl+S` | Save |
| `Ctrl+Shift+S` | Save as |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+K` | Insert link |
| `F11` | Toggle fullscreen |
| `Ctrl+Shift+T` | Toggle theme |
| `/` | Open slash commands |

---

## Settings

### Theme
- Click the sun/moon icon in the status bar
- Or press `Ctrl+Shift+T`
- Your choice is saved and remembered next time

---

## Development

### Prerequisites
- **Node.js 18+** (recommended: 20 LTS)
- **npm 9+**
- **Git**

### Setup
```bash
git clone https://github.com/MinikLover67/Minik-s-Cursus.git
cd cursus
npm install
npm run build
npx electron .
```

### Development Mode
```bash
npm run dev
```
Starts both the main process (watch mode) and renderer (Vite dev server).

---

## Building & Packaging

```bash
# Production build
npm run build

# Windows (portable + installer)
npm run package:win
```

Build outputs go to the `release/` folder.

---

## Project Structure

```
Cursus/
├── electron/               # Electron main process
│   ├── main/
│   │   ├── index.ts        # App entry point, window, menu
│   │   ├── ipc/            # IPC handlers (file, app)
│   │   └── utils/          # JSON store
│   └── preload/
│       └── preload.ts      # Context bridge
├── src/                    # Renderer process
│   ├── main.ts             # Entry point
│   ├── index.html          # HTML shell
│   ├── editor/
│   │   ├── CursusEditor.ts # Tiptap editor wrapper
│   │   └── toolbar/        # Toolbar
│   ├── ui/
│   │   ├── App.ts          # UI init, menus, loading screen
│   │   ├── Sidebar.ts      # Sidebar navigation
│   │   ├── StatusBar.ts    # Status bar
│   │   ├── ThemeManager.ts # Theme toggle
│   │   └── WelcomeGuide.ts # First-run guide
│   ├── styles/             # CSS (main, editor, home, themes)
│   └── lib/                # Type declarations, utilities
├── _archived/              # Temporarily removed features (gitignored)
├── release/                # Build output
├── dist/                   # Compiled output
└── build/                  # Icons and resources
```

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Desktop Framework | Electron 33+ |
| Text Editor | Tiptap 2 (ProseMirror) |
| Language | TypeScript 5.6 |
| Main Process Bundler | esbuild |
| Renderer Bundler | Vite 5 |
| PDF | pdf-lib + pdfjs-dist |
| DOCX | mammoth + JSZip |
| PPTX | pptxgenjs |
| Syntax Highlighting | lowlight (highlight.js) |
| Installer (Windows) | electron-builder + NSIS |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Copyright (c) 2026 MinikLover67
