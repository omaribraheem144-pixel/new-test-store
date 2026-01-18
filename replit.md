# replit.md

## Overview

This is an Arabic e-commerce web application built with a React frontend and Express backend. The application provides a product catalog, shopping cart functionality, and user authentication through Replit Auth. The interface is designed for right-to-left (RTL) Arabic language support with an elegant, modern UI using shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (light/dark mode support)
- **Build Tool**: Vite for development and production builds

The frontend follows a component-based architecture with:
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Custom application components in `client/src/components/`
- Custom hooks in `client/src/hooks/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth integration using OpenID Connect (OIDC) with Passport.js
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage

The backend follows a modular structure:
- `server/index.ts`: Main Express application setup
- `server/routes.ts`: API route definitions
- `server/storage.ts`: Data access layer with DatabaseStorage class
- `server/db.ts`: Database connection configuration
- `server/replit_integrations/auth/`: Replit Auth integration module

### Data Storage
- **Database**: PostgreSQL accessed via Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines all database tables
- **Tables**:
  - `products`: Product catalog with name, description, price, image, category, stock
  - `cart_items`: Shopping cart items linked to users and products
  - `users`: User accounts (managed by Replit Auth)
  - `sessions`: Session storage for authentication

### API Structure
RESTful API endpoints under `/api/`:
- `GET /api/products`: List all products
- `GET /api/products/:id`: Get single product
- `POST /api/cart`: Add item to cart (authenticated)
- `GET /api/cart`: Get cart items (authenticated)
- `PUT /api/cart/:id`: Update cart item quantity (authenticated)
- `DELETE /api/cart/:id`: Remove cart item (authenticated)
- `GET /api/auth/user`: Get current authenticated user

### Authentication Flow
- Uses Replit Auth via OpenID Connect
- Session-based authentication stored in PostgreSQL
- Protected routes use `isAuthenticated` middleware
- Login redirects to `/api/login`, logout to `/api/logout`

## External Dependencies

### Third-Party Services
- **Replit Auth**: OpenID Connect authentication provider (configured via `ISSUER_URL` environment variable)
- **PostgreSQL Database**: Requires `DATABASE_URL` environment variable for connection

### Key NPM Dependencies
- **UI Framework**: `@radix-ui/*` components, `tailwindcss`, `class-variance-authority`
- **Data Fetching**: `@tanstack/react-query`
- **Database**: `drizzle-orm`, `pg`, `connect-pg-simple`
- **Authentication**: `passport`, `openid-client`, `express-session`
- **Validation**: `zod`, `drizzle-zod`
- **Build Tools**: `vite`, `esbuild`, `tsx`

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `REPL_ID`: Replit deployment identifier (used for OIDC client ID)
- `ISSUER_URL`: OpenID Connect issuer URL (defaults to Replit's OIDC endpoint)