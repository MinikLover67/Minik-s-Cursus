# Contributing to Cursus

Thank you for your interest in contributing to Cursus! This guide will help you get started.

## Getting Started

### Prerequisites

- **Node.js 18+** (recommended: 20 LTS)
- **npm 9+**
- **Git**
- **Windows/macOS/Linux**

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cursus.git
   cd cursus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

4. **Build the app**
   ```bash
   npm run build
   ```

5. **Package for your platform**
   ```bash
   # Windows portable exe
   npx electron-builder --win portable

   # macOS
   npx electron-builder --mac

   # Linux
   npx electron-builder --linux
   ```

## Project Structure

```
Cursus/
├── electron/           # Electron main process (Node.js)
│   ├── main/          # App entry, window management, menus
│   │   ├── index.ts   # Main entry point
│   │   ├── ipc/       # IPC handlers (file, AI, app)
│   │   ├── services/  # Backend services (AI, document handling)
│   │   └── utils/     # Utilities (store)
│   ├── preload/       # Context bridge (secure API surface)
│   └── shared/        # Shared type definitions
├── src/               # Renderer process (Browser)
│   ├── editor/        # Tiptap editor core & extensions
│   ├── ai/            # AI integration UI
│   ├── ui/            # UI components (sidebar, guide, settings)
│   ├── i18n/          # Internationalization (7 languages)
│   ├── styles/        # CSS styles & themes
│   ├── lib/           # Utilities
│   ├── docx/          # DOCX viewer/importer
│   └── pdf/           # PDF viewer/editor
├── build/             # Build assets (icons)
└── .github/           # GitHub Actions CI
```

## How to Contribute

### Reporting Bugs

1. Check existing issues first
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - OS and Electron version

### Suggesting Features

1. Check existing issues/discussions
2. Create an issue with the `enhancement` label
3. Describe the feature and its use case

### Code Contributions

1. Create a branch from `main`
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make your changes
   - Follow the existing code style
   - Add TypeScript types where needed
   - Keep changes focused and atomic

3. Test your changes
   ```bash
   npm run build
   npx electron .
   ```

4. Commit with a clear message
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. Push and create a Pull Request
   ```bash
   git push origin feature/your-feature
   ```

## Code Style

- **TypeScript** for all new code
- **No comments** unless absolutely necessary
- **Functional components** for UI
- **Error handling** for all async operations
- **Type safety** — avoid `any` types

## Building & Testing

### Development
```bash
npm run dev          # Start dev mode (main + renderer)
```

### Production Build
```bash
npm run build        # Build all (main + preload + renderer)
```

### Packaging
```bash
npx electron-builder --win portable    # Windows portable
npx electron-builder --win nsis        # Windows installer
npx electron-builder --mac dmg         # macOS DMG
npx electron-builder --linux AppImage  # Linux AppImage
```

## AI Integration

The app supports three AI backends:

1. **Ollama** (recommended) — Local AI models
2. **llama.cpp** — Embedded local models
3. **Custom API** — Any OpenAI-compatible endpoint

When adding AI features, ensure they work with all backends.

## Document Formats

Supported formats and their handling:

| Format | Library | Notes |
|--------|---------|-------|
| MD/HTML/TXT | Native | Full editing |
| DOCX | mammoth + docx | Import/export |
| PDF | pdf-lib + pdf.js | View/create/edit |
| XLSX | Dynamic import | Read as tables |
| PPTX | pptxgenjs | Create only |

## Questions?

Open a discussion on GitHub or create an issue.
