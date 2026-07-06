<div align="center">

# Cursus

### AI-Powered Rich Text Editor for Students & Teachers

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-33+-purple.svg)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

A modern desktop editor for students and teachers. Write, edit, and manage documents with **local AI assistance** — no internet required.

</div>

---

## Table of Contents

- [Downloads](#downloads)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation Guide](#installation-guide)
- [User Guide](#user-guide)
- [AI Setup](#ai-setup)
- [Document Formats](#document-formats)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Settings](#settings)
- [File Associations](#file-associations)
- [Development](#development)
- [Building & Packaging](#building--packaging)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [FAQ / Troubleshooting](#faq--troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Downloads

| File | Type | Size | Description |
|------|------|------|-------------|
| [Cursus Setup 1.0.0.exe](publish/Cursus%20Setup%201.0.0.exe) | **Installer** (NSIS) | ~91 MB | Full installer, registers file associations, adds start menu & desktop shortcuts |
| [Cursus-1.0.0-portable.exe](publish/Cursus-1.0.0-portable.exe) | **Portable** | ~91 MB | No installation needed, run from USB or anywhere |

**Which one should I download?**
- **Installer** — If you want Cursus to appear in the "Open with" dialog for PDF/DOCX/etc. files. Requires admin rights to install.
- **Portable** — If you want to run Cursus from a USB drive or don't have admin rights. No file associations.

---

## Features

### Rich Text Editing
- Headings (H1–H6), bold, italic, underline, strikethrough
- Subscript, superscript, inline code
- Bullet lists, ordered lists, task lists (checkboxes)
- Blockquotes, code blocks with syntax highlighting (40+ languages)
- Tables with resizable columns
- Links, images (drag & drop or paste), horizontal rules
- Text alignment (left, center, right)
- Font family selection, text color, highlight (multicolor)
- Undo / redo history
- Full screen mode

### AI-Powered Writing
- **Ollama** — Local AI models (Llama, Mistral, CodeLlama, etc.)
- **LM Studio** — Local AI via OpenAI-compatible API
- **Custom API** — Bring your own API key (OpenAI, Claude, etc.)
- **Continue Writing** — Let AI finish your sentences
- **Improve** — Enhance writing quality and flow
- **Proofread** — Fix grammar, spelling, and punctuation
- **Summarize** — Condense long text into a few sentences
- **Simplify** — Make text easier to understand
- **Translate** — Translate between English, Spanish, French, German, Chinese
- **Explain Code** — Get detailed code explanations
- **Fix Grammar** — AI-powered grammar correction
- **Make Formal** — Convert casual text to formal
- **Customizable prompts** — All AI prompts can be edited

### Document Support
| Format | Read | Write / Export | Edit In-Place |
|--------|------|----------------|---------------|
| Markdown (.md) | ✅ Full | ✅ | ✅ Rich text or source |
| HTML (.html, .htm) | ✅ Full | ✅ | ✅ Rich text |
| Plain Text (.txt) | ✅ Full | ✅ | ✅ |
| Word (.docx) | ✅ Converted | ✅ | ✅ After conversion |
| PDF (.pdf) | ✅ Imported | ✅ Export with watermark | ✅ Basic |
| Excel (.xlsx, .xls) | ✅ As table | ✅ Export | ✅ |
| PowerPoint (.pptx) | ✅ | ✅ pptxgenjs | — |
| CSV (.csv) | ✅ | ✅ | ✅ |
| JSON (.json) | ✅ | ✅ | ✅ |

### User Experience
- **Dual-screen design** — Home screen (start page) + Editor screen (toolbar, sidebar, status bar)
- **Office Word-like** — New Document / Open File cards on home, full toolbar in editor
- **Light & Dark themes** — Toggle anytime via button or Ctrl+Shift+T
- **7 Interface languages** — English, Spanish, French, German, Chinese, Japanese, Korean
- **Welcome guide** — First-time user overlay with tips
- **Recent files** — Quick access from sidebar or home screen
- **Drag & drop** — Open files or insert images by dragging
- **Paste images** — Paste from clipboard directly into the editor
- **Word count** — Live word count in status bar
- **AI status indicator** — See if Ollama/LM Studio is running in the status bar

---

## Quick Start

### Running the Portable Version
1. Download `Cursus-1.0.0-portable.exe` from [Downloads](#downloads)
2. Double-click to run — no installation needed
3. Click **New Document** on the home screen to start writing

### Installing via Setup
1. Download `Cursus Setup 1.0.0.exe` from [Downloads](#downloads)
2. Run the installer (requires admin rights)
3. Launch Cursus from Start Menu or desktop shortcut
4. After installation, you can right-click any `.md` or `.pdf` file → **Open with** → **Cursus**

### First Steps
1. **Home Screen** — Shows New Document and Open File cards, recent files, and links to AI Settings / User Guide / Theme Toggle
2. **Create a new document** — Click "New Document" on home screen or press `Ctrl+N`
3. **Open a file** — Click "Open File" on home screen or press `Ctrl+O`
4. **Format text** — Use the toolbar (bold, italic, headings, lists, etc.)
5. **Save** — Press `Ctrl+S` or use File → Save
6. **Switch themes** — Click the sun/moon icon in the status bar or press `Ctrl+Shift+T`
7. **Return to Home** — Click the Home button in the sidebar

---

## Installation Guide

### Windows
1. **Portable** — Just run `Cursus-1.0.0-portable.exe` anywhere
2. **Installer** — Run `Cursus Setup 1.0.0.exe` → Choose install location → Finish

### macOS & Linux
Pre-built binaries are not yet available for macOS and Linux. You'll need to [build from source](#development).

Minimum system requirements:
- OS: Windows 10+ / macOS 12+ / Linux (with glibc 2.28+)
- RAM: 512 MB (2 GB+ recommended for AI features)
- Disk: 200 MB for the app (plus AI model files if using local AI)
- For AI features: Ollama or LM Studio installed separately

---

## User Guide

### Home Screen
When you open Cursus, you see the **Home Screen** with:
- **App logo and title** — "Cursus" at the top
- **New Document card** — Creates a blank document and switches to editor
- **Open File card** — Opens a file browser to pick a document
- **Recent Files list** — Shows your recently opened files (click to reopen)
- **Footer links** — AI Settings, User Guide, Toggle Theme

### Editor Screen
The editor has four main areas:

**1. Sidebar** (left panel)
- **Home button** — Returns to home screen
- **New button** — Clears editor for a new document
- **Open button** — Opens a file
- **Recent files** — Click to reopen

**2. Toolbar** (top bar)
- Undo / Redo
- Heading dropdown (Normal, H1–H6)
- Bold / Italic / Underline / Strikethrough / Subscript / Superscript
- Bullet list / Ordered list / Task list
- Text alignment (Left / Center / Right)
- Code / Code block / Blockquote / Horizontal rule
- Link / Image
- AI button — Opens the AI assistant popup

**3. Editor area** (center)
- Type or paste content directly
- Drag & drop images or files
- Right-click for context menu (cut, copy, paste)

**4. Status bar** (bottom)
- File path of the current document
- Word count (updates as you type)
- AI status indicator (shows if Ollama/LM Studio is running)
- Theme toggle button

### Using the AI Assistant
1. Click the **AI button** (sparkle icon) in the toolbar
2. Select an AI model from the dropdown
3. Type a prompt or click a template button (Fix Grammar, Simplify, etc.)
4. Click **Generate**
5. If you selected text before clicking the AI button, the result replaces the selection

---

## AI Setup

### Option 1: Ollama (Recommended — Free, Local, No Internet)

1. Download and install [Ollama](https://ollama.ai)
2. Open a terminal and pull a model:
   ```bash
   ollama pull llama3.2:3b
   ```
   Recommended models:
   - `llama3.2:3b` — Fast, good for general writing (2 GB)
   - `llama3.1:8b` — More capable, slower (4.7 GB)
   - `mistral` — Good alternative (4.1 GB)
   - `codellama` — Best for code (3.8 GB)
3. Open Cursus → **AI Settings** → Select **Ollama (Local)**
4. Click **Check** to verify the connection
5. Select a model from the dropdown
6. Click **Save Settings**

### Option 2: LM Studio (Free, Local, OpenAI-Compatible)

1. Download and install [LM Studio](https://lmstudio.ai)
2. Open LM Studio, search and download a model (e.g., Phi-3, Llama-3.2)
3. Start the local inference server in LM Studio (port 1234 by default)
4. Open Cursus → **AI Settings** → Select **LM Studio (Local)**
5. Enter the URL (default `http://localhost:1234`)
6. Click **Check** to verify and load models
7. Select a model from the dropdown
8. Click **Save Settings**

### Option 3: Custom API

1. Open Cursus → **AI Settings** → Select **Custom API**
2. Enter your API endpoint (e.g., `https://api.openai.com/v1/chat/completions`)
3. Enter your API key (e.g., `sk-...`)
4. Enter the model name (e.g., `gpt-4`, `claude-3`)
5. Click **Save Settings**

### AI Prompt Templates

The AI popup in the toolbar includes template buttons:
- **Fix Grammar** — Fix grammar and spelling
- **Simplify** — Make text easier to understand
- **Summarize** — Condense text
- **Expand** — Add more detail
- **Improve** — Enhance writing quality
- **Formal** — Make text more formal

You can customize these prompts by editing them in `electron/main/services/ai/promptBuilder.ts`.

---

## Document Formats

### How Each Format is Handled

| Format | Reading | Writing | Editing |
|--------|---------|---------|---------|
| **.md** | Read as text, displayed as rich text | Converted from HTML to Markdown | Full rich text |
| **.html** | Read as HTML | Written as HTML | Full rich text |
| **.txt** | Read as plain text | Written as text (HTML tags stripped) | Full rich text |
| **.docx** | Converted via mammoth | Built via custom XML + JSZip | After conversion |
| **.pdf** | Extracted via pdf-lib | Generated via pdf-lib | Basic text editing |
| **.xlsx** | Read as CSV (via custom handler) | Written as CSV | As plain text table |
| **.pptx** | Read as text | Generated via pptxgenjs | — |
| **.csv** | Read as CSV | Written as CSV | Full rich text |
| **.json** | Read as JSON | Written as JSON | Full rich text |

### Opening Files
- **From home screen** — Click "Open File" card
- **From sidebar** — Click Open button
- **Keyboard** — `Ctrl+O`
- **Drag & drop** — Drop any supported file onto the editor
- **Command line** — `cursus.exe file.md` (after installation with file associations)
- **Double-click** — Double-click a file in File Explorer (after setting Cursus as default app)

### Exporting
- **Save** (`Ctrl+S`) — Saves in the original format
- **Save As** (`Ctrl+Shift+S`) — Choose a new format
- **Export as PDF** — File → Export as PDF
- **Export as DOCX** — File → Export as DOCX
- **Export as Markdown** — File → Export as Markdown

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
| `Ctrl+,` | Open AI settings |
| `Ctrl+X` | Cut |
| `Ctrl+C` | Copy |
| `Ctrl+V` | Paste |
| `Ctrl+A` | Select all |

---

## Settings

### Theme
- Click the sun/moon icon in the status bar
- Or press `Ctrl+Shift+T`
- Your choice is saved and remembered next time

### AI Settings
- Open via **AI** → **AI Settings** in the menu
- Or click **AI Settings** on the home screen footer
- Choose your backend: Ollama, LM Studio, llama.cpp, or Custom API
- Configure URL, model, API key as needed
- Click **Save Settings**

### Interface Language
- Configured via the store (default: English)
- Supported: EN, ES, FR, DE, ZH, JA, KO
- Change by editing the `language` value in `%APPDATA%/cursus-data/config.json`

---

## File Associations

After installing via the NSIS installer (`Cursus Setup 1.0.0.exe`), Cursus registers itself for these file types:

`.pdf`, `.docx`, `.md`, `.html`, `.htm`, `.txt`, `.xlsx`, `.pptx`, `.csv`, `.json`

### Set Cursus as Default App (Windows 11)
1. Right-click any `.md` file → **Open with** → **Choose another app**
2. Select **Cursus** from the list
3. Check **"Always use this app to open .md files"**
4. Click **OK**

Repeat for other file types as desired.

### What Happens When You Double-Click a File
1. If Cursus is **not running** — It launches and opens the file
2. If Cursus is **already running** — The file opens in the existing window (no second instance)
3. The file opens in the editor and is added to your recent files list

### Note for Portable Users
The portable version does NOT register file associations (since it doesn't install). You can still use "Open with" → "Choose another app" → Browse to `Cursus-1.0.0-portable.exe`, but you'll need to do this every time.

---

## Development

### Prerequisites
- **Node.js 18+** (recommended: 20 LTS)
- **npm 9+**
- **Git**

### Setup
```bash
# Clone the repository
git clone https://github.com/MinikLover67/Minik-s-Cursus.git
cd cursus

# Install dependencies
npm install

# Start development mode (hot reload)
npm run dev
```

> **Note on Windows path with spaces**: If your project path contains spaces (like `Minik's Cursus`), use `esbuild` directly instead of `electron-vite`. This project already handles this correctly.

### Development Mode
- `npm run dev` — Starts both the main process (watch mode) and renderer (Vite dev server)
- Make changes to `src/` — Vite hot-reloads the renderer
- Make changes to `electron/` — Restart Electron to see changes

---

## Building & Packaging

```bash
# Production build (main + preload + renderer)
npm run build

# --- Windows ---
npx electron-builder --win portable   # Portable .exe (no install)
npx electron-builder --win nsis       # Installer (registers file associations)
npx electron-builder --win            # Both portable + installer

# --- macOS ---
npx electron-builder --mac dmg

# --- Linux ---
npx electron-builder --linux AppImage

# --- All platforms (if on CI) ---
npm run package:win
npm run package:mac
npm run package:linux
```

### Build outputs
All builds go to the `release/` folder:
- `Cursus-1.0.0-portable.exe` — Portable version
- `Cursus Setup 1.0.0.exe` — NSIS installer
- `win-unpacked/` — Unpacked app (for debugging)

For distribution, copy the installer and portable exe to the `publish/` folder.

---

## Project Structure

```
Cursus/
├── electron/               # Electron main process (Node.js)
│   ├── main/
│   │   ├── index.ts        # App entry point, window management, menu
│   │   ├── ipc/            # IPC handlers
│   │   │   ├── index.ts    # Registers all IPC handlers
│   │   │   ├── ai.ipc.ts   # Ollama + LM Studio + Custom AI
│   │   │   ├── file.ipc.ts # File open/save/recent
│   │   │   └── app.ipc.ts  # Store, version, paths
│   │   ├── services/       # Backend services
│   │   │   ├── ai/         # AI providers (ollama, lmstudio, llamacpp)
│   │   │   ├── docx/       # DOCX read/write
│   │   │   ├── pdf/        # PDF read/write/edit
│   │   │   ├── xlsx/       # XLSX handler
│   │   │   ├── pptx/       # PPTX handler
│   │   │   └── converter.ts # Format conversion utilities
│   │   └── utils/
│   │       └── store.ts    # JSON file store (replaces electron-store)
│   ├── preload/
│   │   └── preload.ts      # Context bridge (secure API surface)
│   └── shared/
│       └── ipc-types.ts    # Shared type definitions
├── src/                    # Renderer process (Chromium)
│   ├── main.ts             # Renderer entry point
│   ├── index.html          # HTML shell (home screen + editor screen + overlays)
│   ├── editor/
│   │   ├── CursusEditor.ts # Tiptap editor wrapper (20+ extensions)
│   │   └── toolbar/
│   │       └── Toolbar.ts  # Dynamic toolbar with 25+ buttons
│   ├── ui/
│   │   ├── App.ts          # UI initialization, menu listeners, drag/drop
│   │   ├── Sidebar.ts      # Sidebar buttons, recent files, navigation
│   │   ├── StatusBar.ts    # Status bar (file path, word count, AI status)
│   │   ├── ThemeManager.ts # Theme toggle
│   │   ├── WelcomeGuide.ts # First-run welcome overlay
│   │   └── AiSettings.ts   # AI settings panel
│   ├── styles/
│   │   ├── main.css        # Main layout and component styles
│   │   ├── editor.css      # Tiptap editor styles
│   │   ├── home.css        # Home screen styles
│   │   ├── theme-light.css # Light theme variables
│   │   └── theme-dark.css  # Dark theme variables
│   ├── i18n/               # Internationalization (7 languages)
│   └── lib/
│       ├── api.ts          # Window.electronAPI type declarations
│       └── fileUtils.ts    # File type detection utilities
├── publish/                # Release downloads (setup + portable)
├── release/                # Build output (auto-generated)
├── dist/                   # Compiled output (auto-generated)
├── build/                  # Build resources (icons)
├── .github/workflows/      # GitHub Actions CI
├── package.json            # Dependencies, scripts, electron-builder config
├── vite.renderer.config.ts # Vite configuration
└── tsconfig.json           # TypeScript configuration
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
| AI (Ollama) | Ollama REST API |
| AI (LM Studio) | OpenAI-compatible API |
| AI (llama.cpp) | node-llama-cpp |
| PDF | pdf-lib + pdfjs-dist |
| DOCX | mammoth + JSZip |
| PPTX | pptxgenjs |
| Syntax Highlighting | lowlight (highlight.js) |
| Tooltips | tippy.js |
| HTML→Markdown | turndown |
| Internationalization | i18next |
| Installer (Windows) | electron-builder + NSIS |

---

## FAQ / Troubleshooting

### General

**Q: What is Cursus?**
A: Cursus is an AI-powered rich text editor for Windows, macOS, and Linux. It lets you write documents with formatting, open many file types, and use local AI models for writing assistance — all without an internet connection.

**Q: Is Cursus free?**
A: Yes. Cursus is open source under the MIT License. It's completely free to use, modify, and distribute.

**Q: Do I need an internet connection to use Cursus?**
A: No. Cursus works entirely offline. AI features use local models via Ollama or LM Studio. No data leaves your computer.

**Q: Which platforms are supported?**
A: Windows (10+), macOS (12+), Linux (with glibc 2.28+). Pre-built binaries are currently available for Windows. macOS and Linux users need to build from source.

**Q: Can I open Word documents in Cursus?**
A: Yes. Cursus can open .docx files (converted via mammoth), edit them as rich text, and save them back as .docx.

**Q: Can I open PDFs in Cursus?**
A: Yes. Cursus imports PDF text via pdf-lib, allows basic editing, and can export back to PDF with watermark support.

### Installation

**Q: What's the difference between the installer and the portable version?**
A: The installer (NSIS) requires admin rights, adds Cursus to the Start Menu, creates desktop shortcuts, and registers file associations so you can open .pdf, .docx, .md etc. by double-clicking. The portable version is a single .exe that runs anywhere with no installation.

**Q: Why does the installer ask for admin rights?**
A: To register file associations (writing to `HKEY_LOCAL_MACHINE`) and create shortcuts in system-wide locations.

**Q: Can I run the portable version from a USB drive?**
A: Yes. The portable version saves its settings to the user's AppData folder, not the USB drive. It will remember your settings on any computer you run it from.

### AI

**Q: Which AI backends are supported?**
A: Ollama (recommended), LM Studio, llama.cpp (experimental), and Custom API (OpenAI-compatible endpoints).

**Q: Do I need to download AI models?**
A: Yes. You need to install Ollama or LM Studio separately and download at least one model. See the [AI Setup](#ai-setup) section.

**Q: How much RAM/disk do AI models need?**
A: Small models like `llama3.2:3b` need ~2 GB disk and ~2 GB RAM. Larger models need more.

**Q: Can I use ChatGPT/GPT-4/Claude?**
A: Yes. Select "Custom API" in AI Settings and enter your OpenAI/Anthropic/etc. API endpoint and key.

**Q: Why does the AI popup say "Ollama not running"?**
A: Make sure Ollama is installed and running (look for the llama icon in your system tray). Try clicking "Check" in AI Settings.

**Q: What's the difference between Ollama and LM Studio?**
A: Both run local AI models. Ollama is CLI-focused and manages models automatically. LM Studio has a GUI for downloading and running models and provides an OpenAI-compatible API.

### Editor

**Q: How do I insert an image?**
A: Click the image icon in the toolbar, or drag an image file onto the editor, or paste an image from your clipboard.

**Q: How do I create a table?**
A: The toolbar includes table buttons. Click the table button, choose rows/columns, or insert via the Insert menu.

**Q: How do I add a link?**
A: Select text and click the link icon in the toolbar, or press Ctrl+K, then enter the URL.

**Q: How do I use task lists?**
A: Click the task list button in the toolbar. Each item becomes a checkbox. Click the checkbox to toggle it.

**Q: How do I add a code block with syntax highlighting?**
A: Click the code block button in the toolbar. It supports 40+ languages (JavaScript, Python, HTML, etc.)

**Q: How do I change the font?**
A: Use the font family dropdown in the toolbar. You can also change text color using the color button.

**Q: Can I use markdown shortcuts?**
A: Yes. Type `#` for heading, `*` for bullet list, `>` for blockquote, `` ` `` for inline code, etc.

### Troubleshooting

**Q: The app doesn't start / buttons don't work**
A: This was a known issue in early builds caused by the preload script format mismatch. Download the latest version from the [Releases](https://github.com/MinikLover67/Minik-s-Cursus/releases) page. If the problem persists, run `npm run build` and check for errors.

**Q: "Failed to load preload script" error**
A: This means the preload script format doesn't match the package.json module type. Make sure you're using a build that outputs `preload.cjs` (not `.js`). Run `npm run build:preload` to rebuild.

**Q: The toolbar is empty / no buttons visible**
A: Make sure you have the latest build. The toolbar buttons are created dynamically by `Toolbar.ts`. Run `npm run build` to rebuild.

**Q: How do I reset settings?**
A: Delete the config file at:
- Windows: `%APPDATA%/cursus-data/config.json`
- macOS: `~/Library/Application Support/cursus-data/config.json`
- Linux: `~/.config/cursus-data/config.json`

**Q: I found a bug / have a feature request**
A: Open an issue on GitHub. See [Contributing](#contributing) for guidelines.

---

## Contributing

Contributions are welcome and appreciated! Here's how to get started.

### Reporting Bugs
1. Check existing issues first to avoid duplicates
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Your OS and Cursus version

### Suggesting Features
1. Check existing issues/discussions
2. Create an issue with the `enhancement` label
3. Describe the feature and its use case

### Code Contributions
1. Fork the repository
2. Create a branch from `main`:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes following these guidelines:
   - **TypeScript** for all new code
   - **No comments** unless absolutely necessary
   - **Error handling** for all async operations
   - **Type safety** — avoid `any` types
   - Keep changes focused and atomic
4. Test your changes:
   ```bash
   npm run build
   npx electron .
   ```
5. Commit with a clear message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. Push and create a Pull Request:
   ```bash
   git push origin feature/your-feature
   ```

### Development Workflow
```bash
# Install dependencies
npm install

# Development mode (hot reload for renderer)
npm run dev

# Build everything
npm run build

# Test with Electron
npx electron .

# Package for distribution
npx electron-builder --win        # Windows (portable + installer)
npx electron-builder --mac        # macOS DMG
npx electron-builder --linux      # Linux AppImage
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Copyright (c) 2026 MinikLover67

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

---

## Acknowledgments

- Built on [Tiptap](https://tiptap.dev/) — a powerful headless editor framework
- Powered by [Ollama](https://ollama.ai) and [LM Studio](https://lmstudio.ai) for local AI
- Desktop framework by [Electron](https://electronjs.org)
- Syntax highlighting by [lowlight](https://github.com/wooorm/lowlight)
- PDF support via [pdf-lib](https://pdf-lib.js.org/)
- DOCX import via [mammoth](https://github.com/mwilliamson/mammoth.js)
- PPTX export via [pptxgenjs](https://github.com/gitbrent/PptxGenJS)
- Tooltips by [tippy.js](https://atomiks.github.io/tippyjs/)
- Internationalization via [i18next](https://www.i18next.com/)
