# ChatGPT Clone Tutorial Application

## Overview

This is a ChatGPT-style conversational AI application built as a tutorial project. The application provides a chat interface where users can interact with Google's Gemini AI model. It features a modern, responsive UI with sidebar navigation, conversation management, and real-time AI responses.

The project demonstrates building a production-ready chat interface using modern web technologies and best practices for component architecture and state management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- **Vite** as the build tool and development server, configured to run on port 5000
- **React 18** with TypeScript for type-safe component development
- **Strict Mode** enabled for development best practices
- Path aliases configured (`@/*` maps to `./src/*`) for cleaner imports
- Development server configured with `host: "0.0.0.0"` and `allowedHosts: true` for Replit proxy compatibility

**UI Component System**
- **Chakra UI v3** as the primary component library, providing a comprehensive design system
- **Emotion** for CSS-in-JS styling capabilities
- **next-themes** for theme management (light/dark mode support)
- Custom component wrappers built on top of Chakra UI primitives located in `src/components/ui/`
- **react-icons** library for consistent iconography throughout the application

**State Management**
- React Context API for sidebar visibility state (`SidebarContext`)
- Local component state using `useState` hooks for form inputs and chat messages
- `useControllableState` pattern in UI components for flexible controlled/uncontrolled usage

**Component Architecture**
- Functional components with React hooks
- Separation of concerns: UI components (`src/components/ui/`) vs. application components
- Layout components: `Sidebar`, `TopSection`, `MiddleSection`, `BottomSection`
- Reusable custom components wrapping Chakra UI for consistent behavior

### External Dependencies

**AI Integration**
- **Google Generative AI SDK** (`@google/generative-ai`) version 0.24.1
- Integration with Gemini 2.5 Flash Lite model for chat completions
- API key managed via environment variable (`VITE_GOOGLE_API_KEY`)
- Chat history support for contextual conversations
- Error handling and fallback messaging for API failures

**Development Tools**
- **ESLint** with TypeScript support for code quality
- **typescript-eslint** for TypeScript-specific linting rules
- React-specific ESLint plugins (`react-hooks`, `react-refresh`)
- **vite-tsconfig-paths** plugin for TypeScript path alias resolution
- TypeScript configured with strict mode and comprehensive linting rules

**Key Technical Decisions**

1. **Vite over Create React App**: Chosen for faster development server startup and optimized build performance
2. **Chakra UI v3**: Selected for its comprehensive component library, accessibility features, and theming capabilities
3. **TypeScript**: Provides type safety and better developer experience with autocomplete and error detection
4. **Gemini API**: Using Google's Generative AI for chat functionality rather than OpenAI's API
5. **Context API**: Lightweight state management solution appropriate for the application's scope (sidebar visibility)
6. **Component Composition**: Heavily leveraging React's composition pattern with forwardRef for flexible, reusable components

**Application Structure**
- Single-page application with no routing
- Responsive design with mobile-first considerations
- Server configured to listen on all network interfaces (`0.0.0.0`) for development accessibility

## Setup Instructions

### Environment Variables
The application requires a Google Gemini API key to function:
- **VITE_GOOGLE_API_KEY**: Your Google Gemini API key for AI chat functionality
- The app will run without the key but will display a warning in the console and AI features won't work

### Development
- Run `npm run dev` to start the development server on port 5000
- The server is configured to work with Replit's proxy environment

### Deployment
- Deployment target: **autoscale** (suitable for this stateless SPA)
- Build command: `npm run build`
- Run command: `npx vite preview --host 0.0.0.0 --port 5000`
- The app will be accessible via a public URL when deployed

## Recent Changes

### October 2, 2025 - Replit Environment Setup
- Successfully imported project from GitHub
- Installed all npm dependencies (314 packages)
- Verified Vite configuration is properly set up for Replit environment:
  - Server running on port 5000
  - Host set to 0.0.0.0 for network accessibility
  - allowedHosts enabled for Replit proxy compatibility
- Configured deployment settings for autoscale deployment
- Development server workflow is running successfully
- Application UI is loading correctly (displaying Arabic interface)
- Note: VITE_GOOGLE_API_KEY environment variable needs to be set by user for AI functionality to work

### Getting Your Google API Key
To enable the AI chat functionality, you'll need to:
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key for the Gemini API
3. Add the API key to your Replit Secrets with the name `VITE_GOOGLE_API_KEY`
4. Restart the development server to apply the changes