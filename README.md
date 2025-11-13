# 🔍 GitHub Commit Explorer

> **An application for exploring GitHub repositories, analyzing commits, and managing favorite commits.**

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, type-safe web application built with Vue 3 Composition API and TypeScript that provides a seamless interface for exploring GitHub repositories, viewing commit histories, and managing favorite commits with persistent storage.

## 🚀 Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-%F0%9F%94%97-blue)](https://github-commit-explorer.vercel.app/)

Test with popular GitHub usernames like `sinethembadlova`, `octocat`, or any public GitHub user!

---

## ✨ Features

### Core Functionality

- 🔍 **Repository Explorer** - Browse any GitHub user's public repositories with detailed metadata
- 📜 **Commit History Viewer** - Paginated commit lists (10 per page) with infinite scroll capability
- ⭐ **Favorites Management** - Mark commits as favorites with persistent localStorage storage
- 📊 **Detailed Commit Analysis** - View file changes, diffs, additions/deletions with syntax highlighting
- 🔄 **Smart Sorting** - Sort commits by newest or oldest with optimized rendering
- ✅ **Form Validation** - Real-time GitHub username validation with helpful error messages
- 🗑️ **Bulk Actions** - Clear all favorites at once or remove them individually

### Technical Highlights

- 🛡️ **Comprehensive Error Handling** - Graceful handling of 404s, rate limiting, network errors, and corrupted data
- 📱 **Fully Responsive** - Premium UI that works seamlessly on desktop, tablet, and mobile
- 💾 **Persistent State** - Favorites survive browser sessions with automatic validation and cleanup
- 🎨 **Premium Dark Theme** - Black, dark grey, and grey color palette with subtle accents
- 🌙 **Dark Mode First** - Optimized for low-light viewing with carefully chosen colors

## 🛠️ Tech Stack

### Frontend Framework

- **Vue 3.5** - Latest Vue with Composition API, `<script setup>`, and performance improvements
- **TypeScript 5.0** - Full type safety with strict mode enabled
- **Vue Router v4** - Client-side routing with nested routes and params
- **System Fonts Only** - Zero external font requests for instant loading

### State Management

- **Pinia** - Official Vue state management with TypeScript support and DevTools integration
- **localStorage Persistence** - Automatic validation and cleanup of stored favorites

### Build & Development

- **Vite 5.0** - Lightning-fast HMR and optimized production builds
- **ESBuild** - Ultra-fast TypeScript compilation
- **Rollup** - Optimized production bundling with code splitting

### Testing

- **Vitest** - Vite-native test runner with instant feedback
- **Vue Test Utils** - Official Vue component testing library
- **Happy DOM** - Fast DOM implementation for tests

### UI & Styling

- **Radix Vue** - Accessible, unstyled component primitives (Select, Dialog, etc.)
- **Tailwind CSS v4** - Utility-first CSS with custom dark theme configuration
- **Lucide Vue Next** - Beautiful, consistent icon library for Vue 3
- **System Fonts** - Zero external font requests for instant loading
- **Custom Favicon** - GitHub logo branding in browser tabs

### API Integration

- **GitHub REST API v3** - Public API endpoints (no authentication required)
- **Native Fetch** - Modern, promise-based HTTP client

## 📁 Project Structure

```
src/
├── components/
│   ├── NavBar.vue              # Reusable navigation header
│   ├── RepositoryList.vue      # Repository list component
│   ├── CommitList.vue          # Commit list with sorting
│   ├── FavoritesList.vue       # Favorites sidebar with clear all
│   └── CommitDetails.vue       # Commit details modal with diffs
├── services/
│   └── githubApi.ts            # GitHub API service layer
├── stores/
│   └── githubStore.ts          # Pinia store with validation
├── types/
│   └── github.ts               # TypeScript interfaces
├── views/
│   ├── date.ts                 # All reusable utility on dates.
├── views/
│   ├── HomeView.vue            # Home page with username input
│   └── RepoView.vue            # Repository and commits page
├── router/
│   └── index.ts                # Vue Router configuration
├── App.vue                     # Root component with dark theme
├── main.ts                     # App initialization
└── index.css                   # Global styles with dark theme variables
```

## 🚀 Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/github-commit-explorer-vuejs.git
   cd github-commit-explorer-vuejs
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run development server**:

   ```bash
   npm run dev
   ```

4. **Run tests**:

   ```bash
   npm test
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## 📖 Usage

1. **Home Page**: Enter a GitHub username (e.g., `octocat`, `sinethembadlova`)
2. **Repository Page**:
   - Select a repository from the left panel (shows language, stars, and description)
   - View commits in the center panel with author avatars and timestamps
   - Sort commits by "Newest First" or "Oldest First"
   - Click "View Details" to see file changes and diffs with syntax highlighting
   - Click "Favorite" to add commits to your favorites
   - View and manage favorites in the right panel (shows username/repo)
   - Click "Clear" to remove all favorites at once
   - Load more commits with pagination

## 🔌 API Integration

The app uses the GitHub REST API v3 (public endpoints, no authentication required):

- **Repositories**: `GET /users/:username/repos`
- **Commits**: `GET /repos/:username/:repo/commits`
- **Commit Details**: `GET /repos/:username/:repo/commits/:sha`

### Rate Limiting

- Unauthenticated requests: 60 requests/hour per IP
- The app handles rate limiting gracefully with error messages

## 🗄️ State Management

Pinia store manages:

- List of repositories with metadata
- List of commits for selected repository
- List of favorite commits (persisted to localStorage with validation)
- Loading and error states
- Pagination state (current page, hasMore flag)
- Sort order (newest/oldest)

### Store Features

- **Automatic Validation** - Invalid favorites are filtered on load
- **Data Cleanup** - Corrupted localStorage data is automatically fixed
- **Type Safety** - Full TypeScript support with proper interfaces
- **Devtools Integration** - Debug state changes in Vue DevTools


## 🛡️ Error Handling

The application handles:

- **Invalid GitHub usernames** - Format validation (alphanumeric and hyphens)
- **User not found** - 404 errors with helpful messages
- **API rate limiting** - 403 errors with retry suggestions
- **Empty repositories** - Graceful empty state displays
- **Empty commit lists** - "No commits found" messages
- **Network errors** - Connection failure handling
- **Corrupted localStorage** - Automatic validation and cleanup
- **Invalid date formats** - Fallback to "Invalid date" display
- **Missing commit data** - Defaults for undefined fields

## 🎨 Dark Theme

The application features a carefully crafted dark theme:

### Color Palette

- **Background**: Pure black (`oklch(0.08 0 0)`)
- **Cards**: Very dark grey (`oklch(0.15 0 0)`)
- **Borders**: Subtle grey (`oklch(0.22 0 0)`)
- **Text**: Light grey/white (`oklch(0.95 0 0)`)
- **Muted Text**: Medium grey (`oklch(0.60 0 0)`)
- **Primary**: GitHub green (`oklch(0.55 0.18 155)`)
- **Destructive**: Red for delete actions

### Design Features

- Subtle borders for card separation
- Smooth hover transitions
- Custom scrollbar styling
- Elevated cards with shadows
- Accessible contrast ratios

## 🔑 Key Implementation Details

### Vue 3 Composition API

- `<script setup>` syntax for cleaner component code
- Computed properties for derived state
- Watchers for side effects
- TypeScript with proper type inference

### Form Validation

- GitHub username format validation (alphanumeric and hyphens)
- Length validation (max 39 characters)
- Real-time error feedback
- Prevents empty submissions

### Pagination

- Fetches 10 commits per page
- "Load More" button for additional commits
- Automatically detects when no more commits are available
- Maintains scroll position on load

### Commit Details Modal

- Shows file changes with additions/deletions
- Displays diff patches with syntax highlighting
- Color-coded changes (green for additions, red for deletions, blue for context)
- File status badges (added, modified, removed, renamed)
- Statistics for files changed, total additions, and deletions
- Click outside or ESC to close

### Favorites System

- Stored in localStorage with automatic validation
- Prevents duplicates by SHA
- Shows full path (username/repoName)
- Individual delete buttons on each card
- "Clear All" button in header
- Automatic cleanup of invalid entries
- Displays author, date, and commit SHA

### Component Reusability

- **NavBar** - Reusable header with configurable title, subtitle, and back button
- **RepositoryList** - Self-contained repository display
- **CommitList** - Handles sorting and pagination internally
- **FavoritesList** - Manages favorite display and actions

## 🏗️ Architecture & Design Decisions

### Architectural Patterns

- **Service Layer Pattern** - Abstracted API calls in `services/githubApi.ts`
- **Composition API** - Modern Vue 3 approach with `<script setup>`
- **Type-Safe State** - Pinia store with full TypeScript inference
- **Component Composition** - Small, focused, reusable components
- **Props Down, Events Up** - Unidirectional data flow

### Design Decisions

- **No Shadcn/UI** - Pure Tailwind CSS with Radix Vue primitives only
- **Dark Theme First** - Optimized color palette for the screenshot aesthetic
- **System Fonts** - No external font loading for performance
- **Minimal Dependencies** - Only essential libraries included
- **localStorage Validation** - Automatic cleanup prevents errors

## 🚀 Performance Optimizations

- **Code Splitting** - Automatic route-based code splitting
- **Computed Properties** - Efficient reactive computations
- **Event Delegation** - Optimized event handling
- **Lazy Loading** - Components loaded on demand
- **Memoization** - Computed values cached until dependencies change

## 🔮 Future Enhancements

### Planned Features

- [ ] **Advanced Search** - Filter commits by message, author, or date range
- [ ] **Commit Comparison** - Side-by-side diff view for any two commits
- [ ] **Export Functionality** - Export favorites as JSON/CSV
- [ ] **Analytics Dashboard** - Commit frequency graphs, contributor stats
- [ ] **Keyboard Shortcuts** - Quick navigation and actions
- [ ] **Themes** - Light mode and custom color schemes

### Technical Improvements

- [ ] **GitHub OAuth** - Authentication for higher rate limits (5000 req/hr)
- [ ] **Virtual Scrolling** - Handle repositories with thousands of commits
- [ ] **E2E Tests** - Playwright or Cypress integration
- [ ] **Storybook** - Component documentation and visual testing
- [ ] **PWA Support** - Offline functionality and installability
- [ ] **Internationalization** - Multi-language support

## 🤝 Contributing

This project follows industry-standard practices:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. **Push** to your branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## 👨‍💻 Author

Built with ❤️ by [Sinethemba Dlova](https://github.com/sinethembadlova) using Vue 3, TypeScript, and modern web technologies.

---

## 🙏 Acknowledgments

- **Vue Team** - For the amazing Vue 3 framework
- **Radix Vue** - For accessible component primitives
- **Tailwind Labs** - For the utility-first CSS framework
- **GitHub** - For the comprehensive REST API
- **Lucide** - For the beautiful icon library

---

**⭐ If you found this project helpful, please consider giving it a star!**