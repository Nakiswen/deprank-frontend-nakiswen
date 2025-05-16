# DepRank - Open Source Contribution Analysis and Allocation System

DepRank is an open source system for tracking dependencies and contributions between software projects, designed to improve the transparency and efficiency of open source collaboration. The project is built with Next.js 15 and React 19, using TypeScript and TailwindCSS for development.

## Project Overview

DepRank provides the following core features:

- **Dependency Analysis**: Track dependency relationships between projects
- **Contribution Assessment**: Analyze and display developer contributions to various dependencies
- **Code Snippet Viewing**: Support for highlighting specific dependency code snippets
- **Contribution Allocation**: Allow users to claim contributions to specific dependencies

## Technology Stack

- **Frontend Framework**: Next.js 15 (App Router), React 19
- **Styling**: TailwindCSS 3.4
- **Language**: TypeScript 5
- **Code Highlighting**: highlight.js 11
- **Build Tool**: Turbopack

## Project Structure

```
deprank-frontend/
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── dependency/[name]/  # Dependency details page
│   │   ├── analysis/           # Contribution analysis page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Layout component
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable components
│   │   ├── Background.tsx      # Background component
│   │   ├── CodeBlock.tsx       # Code block display component
│   │   ├── Footer.tsx          # Footer component
│   │   └── Navbar.tsx          # Navigation bar component
├── public/                     # Static resources
├── assets/                     # Project assets
└── designs/                    # Design resources
```

## Quick Start

### Requirements

- Node.js 18+
- pnpm 8+ (recommended) or npm 9+

### Installing Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### Development Mode

```bash
# Start development server with Turbopack
pnpm dev

# Or using npm
npm run dev
```

The development server will start at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
pnpm build
# Or
npm run build
```

### Starting Production Server

```bash
pnpm start
# Or
npm run start
```

## Main Pages

1. **Home Page** (`/`)
   - Provides search functionality, allowing users to find dependencies via GitHub repository URL
   - Supports keyboard shortcuts (⌘+K) for quick access to search

2. **Dependency Details Page** (`/dependency/[name]`)
   - Displays detailed information about specific dependencies
   - Shows code snippets with syntax highlighting
   - Provides contribution information and claim functionality

3. **Analysis Page** (`/analysis`)
   - Lists all dependencies and their contributor information
   - Provides search and filtering capabilities
   - Visualizes contribution percentages

## Component Information

### CodeBlock

Code block display component, supporting:
- Syntax highlighting (based on highlight.js)
- Line number display
- Filename display
- Custom starting line number

### Navbar

Top navigation bar component, containing project logo and navigation links.

### Background

Page background component, providing visual effects.

### Footer

Footer component, containing copyright information and links.

## Development Guide

### Adding New Pages

1. Create new folder and `page.tsx` file in the `src/app` directory
2. Use Next.js App Router routing rules for routing configuration

### Adding New Components

1. Create new `.tsx` file in the `src/components` directory
2. Follow existing component naming and structure conventions
3. Use TailwindCSS for styling

### Code Standards

- Use TypeScript type definitions to ensure type safety
- Follow best practices for React functional components and Hooks
- Use ESLint for code quality checking

## Contribution Guidelines

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

[MIT License](LICENSE)
