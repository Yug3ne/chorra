# Contributing to Chorra

Thank you for your interest in contributing to Chorra! This document provides guidelines and information for contributing to the project.

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Milestones](#milestones)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Requests](#pull-requests)
- [Code Style](#code-style)
- [Questions?](#questions)

---

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/chorra.git
   cd chorra
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Yug3ne/chorra.git
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Convex account (free tier)
- Git

### Initial Setup

```bash
# Install dependencies
pnpm install

# Set up Convex
npx convex auth

# Start dev server
pnpm dev
```

The app will run at **http://localhost:5173**

### Running Tests (future)
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

---

## Project Architecture

### Frontend Stack
```
src/
├── components/           # React components
│   ├── Canvas/          # Excalidraw wrapper
│   ├── Sidebar.tsx      # Navigation
│   ├── SheetSwitcher.tsx # Modal switcher
│   ├── SaveIndicator.tsx # Sync status
│   ├── layout/          # Layout components
│   └── ui/              # shadcn components
├── lib/
│   ├── syncEngine.ts    # Auto-save logic
│   └── hooks/           # Custom hooks
├── store/
│   └── whiteboard.ts    # Zustand state
├── App.tsx              # Root component
└── index.css            # Global styles
```

### Backend Stack
```
convex/
├── schema.ts            # Database schema
├── sheets.ts            # Queries & mutations
└── _generated/          # Auto-generated files
```

### Data Model
```typescript
// Sheet in Convex
{
  _id: Id<"sheets">,
  title: string,                    // Auto-named: "Untitled", "Untitled 1"
  elements: ExcalidrawElement[],   // Drawing data
  appState: {                      // Canvas state
    zoom: { value: number },
    scrollX: number,
    scrollY: number
  },
  createdAt: number,
  updatedAt: number
}
```

---

## Milestones

The project is organized into logical milestones, each representing a phase of development:

### Milestone 1: Core Infrastructure ✅
**Branch**: `milestone/1-core-infrastructure`

Foundational setup:
- Cloudflare Workers
- Vite + React + TypeScript
- Convex backend
- Excalidraw, React Router
- shadcn UI, Tailwind CSS

### Milestone 2: Backend Schema & Database ✅
**Branch**: `milestone/2-backend-schema`

Cloud backend implementation:
- Sheets table with elements & appState
- CRUD queries and mutations
- Auto-naming helper
- Query optimization

### Milestone 3: UI Components & Layout ✅
**Branch**: `milestone/3-ui-components`

User interface:
- Responsive layout with sidebar
- shadcn components (Button, Card, Input, Dialog, etc.)
- Theme system with CSS variables
- Accessible component hierarchy

### Milestone 4: Canvas Integration ✅
**Branch**: `milestone/4-canvas-integration`

Drawing capabilities:
- Excalidraw wrapper component
- Sheet-specific drawing data
- All drawing tools and features
- Dark mode support

### Milestone 5: Auto-Save Sync Engine ✅
**Branch**: `milestone/5-sync-engine`

Cloud synchronization:
- Debounced auto-save (1000ms)
- Sync state tracking
- Instant cancel on sheet switch
- Non-blocking UI

### Milestone 6: Keyboard Shortcuts & Features ✅
**Branch**: `milestone/6-features`

Productivity features:
- Cmd+N: New sheet
- Cmd+K: Sheet switcher with search
- Escape: Close dialogs
- Sheet switcher UI
- Tips element on new sheets

### Milestone 7: Polish & Documentation ✅
**Branch**: `milestone/7-polish`

Final touches:
- Dark mode as default
- Complete README
- Project documentation
- Roadmap

### Milestone 8: User Authentication ✅
**Branch**: `feature/user-auth`

User accounts & authentication:
- Better Auth integration with Convex
- Email/password authentication
- User session management
- Protected routes with AuthGuard
- Login/Signup UI components
- User-scoped sheet data (sheets table has userId)
- Protected mutations with ownership verification
- Per-user sheet filtering in queries

### Phase 2: Collaboration (Partial)
- ✅ User accounts & authentication
- [ ] Real-time multiplayer editing
- [ ] Share sheets with others
- [ ] Permission levels

### Phase 3: Advanced Features (Future)
- Image uploads
- Undo/redo stack
- Sheet templates
- Export as PNG/PDF
- Version history
- Comments & annotations

### Phase 4: Infrastructure (Future)
- Offline support
- Progressive Web App (PWA)
- Mobile app
- Self-hosted option

---

## Making Changes

### Creating a Feature Branch

```bash
# Update main with latest changes
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Convention

Use descriptive branch names:
- `feature/` - New features (e.g., `feature/image-uploads`)
- `fix/` - Bug fixes (e.g., `fix/save-error`)
- `refactor/` - Code refactoring (e.g., `refactor/sync-engine`)
- `docs/` - Documentation updates
- `chore/` - Build, dependencies (e.g., `chore/update-deps`)

### Development Workflow

1. **Create a feature branch** from `main`
2. **Make your changes** with meaningful commits
3. **Test locally** before pushing
4. **Push to your fork**
5. **Create a Pull Request** against `upstream/main`

---

## Commit Guidelines

Follow these commit message conventions:

```
type(scope): subject

description

related issues/PRs
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation
- `style` - Code style (formatting, semicolons, etc.)
- `chore` - Build, dependencies
- `test` - Tests

### Examples

```bash
# Good
git commit -m "feat(canvas): add image upload support"
git commit -m "fix(sync): prevent duplicate saves on network error"
git commit -m "docs(readme): update installation instructions"

# Avoid
git commit -m "fixed bug"
git commit -m "updated code"
git commit -m "WIP"
```

---

## Pull Requests

### Before Submitting a PR

- [ ] Fork the repository
- [ ] Create a feature branch from `main`
- [ ] Test your changes locally
- [ ] Update documentation if needed
- [ ] Ensure no console errors or warnings
- [ ] Follow commit guidelines

### PR Title Format

```
[Feature|Fix|Docs] Brief description of what this PR does
```

Examples:
- `[Feature] Add image upload to sheets`
- `[Fix] Resolve saving error on sheet switch`
- `[Docs] Update API documentation`

### PR Description Template

```markdown
## Description
Brief explanation of what this PR changes.

## Motivation
Why is this change needed? What problem does it solve?

## Changes
- List specific changes made
- Be clear and concise

## Testing
How to test these changes locally.

## Related Issues
Closes #123
Fixes #456

## Screenshots (if applicable)
Include before/after screenshots for UI changes.
```

### Review Process

1. Maintainers will review your PR
2. Request changes if needed
3. Update your PR with feedback
4. Once approved, your PR will be merged!

---

## Code Style

### TypeScript
- Use strict type checking (`strict: true` in tsconfig)
- Avoid `any` types where possible
- Use meaningful variable names

### React
- Use functional components with hooks
- Keep components focused and small
- Use custom hooks for logic reuse

### Styling
- Use Tailwind CSS classes
- Follow the theme system (CSS variables)
- Keep styles consistent across components

### File Organization
```
component/
├── Component.tsx      # Main component
├── Component.test.tsx # Tests
└── index.ts          # Export
```

### Linting

```bash
# Run TypeScript check
pnpm run lint

# Format code (if configured)
pnpm run format
```

---

## Questions?

- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Wiki**: Check the project wiki for more documentation
- **Slack** (future): Join our community Slack

---

## License

By contributing to Chorra, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Chorra! 🚀**
