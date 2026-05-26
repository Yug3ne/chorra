# Chora: Multi-Sheet Digital Whiteboard

A modern, cloud-backed digital whiteboard application built with **Excalidraw**, **React**, **Convex**, and **TypeScript**. Create unlimited drawing sheets, switch between them instantly, and auto-save to the cloud.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)
![React](https://img.shields.io/badge/react-19+-blue.svg)

---

## ✨ Features

- **∞ Infinite Sheets** - Create as many whiteboards as you need
- **Instant Switching** - Switch between sheets in milliseconds
- **Auto-Save** - Debounced syncing to cloud (1000ms delay)
- **Full Excalidraw** - All drawing, shape, and text tools
- **Dark Mode** - Beautiful dark theme by default
- **Keyboard Shortcuts**:
  - `Cmd/Ctrl + N` - Create new sheet
  - `Cmd/Ctrl + K` - Open sheet switcher with fuzzy search
  - `Escape` - Close sheet switcher
- **Responsive UI** - Built with shadcn/ui components
- **Cloud Backend** - Powered by Convex for real-time data
- **Single User** - Perfect for personal note-taking and sketching

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Convex account (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/yugene/chora.git
cd chora

# Install dependencies
pnpm install

# Set up Convex
npx convex auth

# Start development server
pnpm dev
```

The app will be available at **http://localhost:5173**

---

## 📁 Project Structure

```
chora/
├── convex/
│   ├── schema.ts          # Database schema for sheets
│   └── sheets.ts          # Queries & mutations
├── src/
│   ├── components/
│   │   ├── Canvas/        # Excalidraw wrapper
│   │   ├── Sidebar.tsx    # Sheet navigation
│   │   ├── SheetSwitcher.tsx  # Modal for switching sheets
│   │   ├── SaveIndicator.tsx  # Save status UI
│   │   ├── layout/
│   │   └── ui/            # shadcn components
│   ├── lib/
│   │   ├── syncEngine.ts  # Debounce logic
│   │   └── hooks/         # Custom React hooks
│   ├── store/
│   │   └── whiteboard.ts  # Zustand state management
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
└── tsconfig.json
```

---

## 🏗️ Architecture

### Frontend Stack
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Zustand** - State management
- **Excalidraw** - Drawing canvas
- **Lucide React** - Icons

### Backend Stack
- **Convex** - Backend & database
- **Serverless Functions** - Queries & mutations
- **Real-time Sync** - Instant data propagation

### Data Model

```typescript
// Sheet document in Convex
{
  _id: Id<"sheets">,
  title: string,                    // e.g., "Untitled", "Untitled 1"
  elements: ExcalidrawElement[],   // Drawing data
  appState: {
    zoom: { value: number },       // Viewport zoom
    scrollX: number,               // Horizontal scroll
    scrollY: number                // Vertical scroll
  },
  createdAt: number,
  updatedAt: number
}
```

---

## 🔄 How It Works

### Creating a Sheet
1. Click "New Sheet" button
2. Auto-generates name: "Untitled", "Untitled 1", etc.
3. Includes a helpful tip element
4. Sheet is immediately available in sidebar

### Drawing & Auto-Save
1. User draws on Excalidraw canvas
2. `onChange` event captures drawing data
3. Debounce waits 1000ms for user to stop
4. Auto-save triggers → Convex mutation → Database
5. "Saving..." indicator appears briefly

### Switching Sheets
1. Click sheet in sidebar OR press `Cmd+K` to search
2. Current sheet is cancelled if saving
3. New sheet data is fetched from Convex
4. Canvas clears and reloads with new data
5. Instant experience with no lag

---

## 🛠️ Development

### Build for Production
```bash
pnpm run build
```

### Type Checking
```bash
pnpm run lint
```

### Deploy
```bash
# Deploy to Convex
npx convex deploy

# Deploy to Cloudflare
pnpm run deploy
```

---

## 📊 Performance

- **Sheet Listing**: O(1) with indexed queries
- **Sheet Loading**: <100ms with Convex
- **Auto-Save**: Debounced to prevent database throttling
- **Bundle Size**: ~1.8MB (uncompressed)
- **Sheet Switching**: Instant with key-based re-render

---

## 🗺️ Roadmap

### Phase 1: Core (✅ Complete)
- [x] Multi-sheet management
- [x] Excalidraw integration
- [x] Auto-save syncing
- [x] Dark mode UI
- [x] Keyboard shortcuts

### Phase 2: Collaboration
- [ ] Real-time multiplayer editing
- [ ] User accounts & authentication
- [ ] Share sheets with others
- [ ] Permission levels

### Phase 3: Advanced Features
- [ ] Image uploads to sheets
- [ ] Undo/redo stack
- [ ] Sheet templates
- [ ] Export as PNG/PDF
- [ ] Version history
- [ ] Comments & annotations

### Phase 4: Infrastructure
- [ ] Offline support
- [ ] Progressive Web App (PWA)
- [ ] Mobile app
- [ ] Self-hosted option

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Milestone PRs

The project is organized into milestone PRs:
1. **Core Infrastructure** - Backend setup
2. **UI Layout** - Layout & sidebar
3. **Canvas Integration** - Excalidraw
4. **Sync Engine** - Auto-save
5. **Features** - Shortcuts & switcher
6. **Polish** - shadcn & dark mode

Each milestone is a separate branch with focused changes.

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

- [Excalidraw](https://excalidraw.com) - Drawing canvas
- [Convex](https://convex.dev) - Backend platform
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [React Router](https://reactrouter.com) - Navigation

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yugene/chora/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yugene/chora/discussions)
- **Docs**: [Project Wiki](https://github.com/yugene/chora/wiki)

---

**Built with ❤️ for digital creativity**
