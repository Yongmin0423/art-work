# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with HMR at http://localhost:5173
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking and generate route types
- `npm run db:generate` - Generate database migrations with Drizzle Kit
- `npm run db:migrate` - Apply database migrations 
- `npm run db:typegen` - Generate TypeScript types from Supabase database

## Project Architecture

This is a React Router v7 application with SSR (Server-Side Rendering) using:
- **Database**: PostgreSQL via Supabase with Drizzle ORM
- **Authentication**: Supabase Auth
- **UI**: Shadcn UI + Radix UI + Tailwind CSS
- **Styling**: TailwindCSS v4 with custom animations
- **Email**: Resend for transactional emails

### Key Architecture Patterns

**Feature-Based Organization**: The app is organized by features under `app/features/`:
- `auth/` - Authentication (login, signup, OTP, social)
- `users/` - User profiles, dashboard, messages, notifications
- `commissions/` - Art commission marketplace
- `community/` - Posts and discussions
- `reviews/` - Review system
- `admin/` - Admin panel for managing content

**Database Schema**: Uses Drizzle ORM with schema files distributed across features:
- Each feature has its own `schema.ts` file
- Common schemas in `app/common/schema.ts`
- Migrations stored in `app/sql/migrations/`
- RLS (Row Level Security) policies defined in schema files

**Route Structure**: File-based routing with nested layouts:
- Routes defined in `app/routes.ts` using React Router v7 syntax
- Layouts for auth, dashboard, profile, admin areas
- Prefix-based grouping (e.g., `/auth/*`, `/my/*`, `/admin/*`)

**Data Layer**: 
- Query functions in `queries.ts` files per feature
- Mutation functions in `mutations.ts` files
- Supabase client setup in `app/supa-client.ts`
- Server-side rendering with auth context in `root.tsx`

### Important Technical Conventions

**React Router v7 Specifics**:
- Use `Route.ComponentProps` type for page components (contains `loaderData`, `actionData`)
- Import route types: `import type { Route } from "./+types/..."`
- No `useLoaderData()` or `useActionData()` - data comes via component props
- Return plain objects from loaders (no `json()` wrapper)
- Use `data()` helper only when returning specific status codes

**Database Patterns**:
- All tables use UUID primary keys with `defaultRandom()`
- RLS policies defined inline with table definitions
- Korean timezone set as default (`Asia/Seoul`)
- Supabase auth integration with profile table sync

**UI Patterns**:
- Always import UI components from Shadcn UI, never directly from Radix
- Use functional components with TypeScript interfaces
- Avoid enums, prefer maps for constants
- Descriptive variable names with auxiliary verbs (`isLoading`, `hasError`)

## File Structure Patterns

- `pages/` - Route components
- `components/` - Feature-specific components
- `layouts/` - Layout components for nested routing
- `queries.ts` - Data fetching functions
- `mutations.ts` - Data mutation functions
- `schema.ts` - Database schema definitions
- `constants.ts` - Feature constants

## Environment & Database

- Requires `DATABASE_URL` environment variable for PostgreSQL connection
- Supabase project integration for auth and real-time features
- Database migrations managed through Drizzle Kit
- TypeScript types auto-generated from Supabase schema

## Resume-worthy Technical Implementations

### Advanced UI/UX Patterns
**Optimistic UI with Debouncing**: 
- Commission likes: `useDebouncedFetcher(300)` + `useState` for immediate UI feedback
- Community upvotes: Instant visual updates before server confirmation
- Custom hook pattern for reusable debounced API calls

**TanStack Table Integration**:
- Advanced data tables with sorting, filtering, pagination
- Column visibility controls and row selection
- Used in admin panels for commission/order management

### React Router v7 SSR Architecture
**Modern Data Loading**:
- Server-side data fetching with `loader` functions returning plain objects
- Type-safe component props with `Route.ComponentProps<typeof loader>`
- No client-side data fetching hooks needed (`useLoaderData` eliminated)

**Sophisticated Routing**:
- Nested layouts with prefix grouping (`/auth/*`, `/my/*`, `/admin/*`)
- Dynamic route parameters with type generation
- Layout-based authentication and authorization

### Database Architecture & Security
**Row Level Security (RLS)**:
- Comprehensive RLS policies defined inline with Drizzle schema
- User-specific data access controls across all tables
- Admin-level and user-level permission separation

**Advanced Schema Design**:
- UUID primary keys with `defaultRandom()` for security
- CASCADE delete relationships for data consistency
- Korean timezone defaults (`Asia/Seoul`) for localization
- Feature-distributed schema files for modularity

### Performance Optimizations
**Debounced API Calls**:
- Custom `useDebouncedFetcher` hook with 300ms delay
- Prevents excessive API requests during rapid user interactions
- Maintains optimistic UI state during debounce period

**SSR Performance**:
- Server-side rendering for SEO and initial load performance
- Hydration-friendly component architecture
- Static asset optimization with Vite bundler

### Type Safety & Developer Experience
**Comprehensive TypeScript**:
- Strict mode enabled with full type coverage
- Auto-generated route types from React Router v7
- Database types generated from Supabase schema
- Path aliases (`~/`) for clean imports

### Business Logic Implementation
**Commission Marketplace**:
- Complete order lifecycle from creation to completion
- Status transitions (pending → accepted → in_progress → completed)
- Real-time messaging between artists and clients
- Review system with rating aggregation

**Admin Management System**:
- Comprehensive dashboard for commission oversight
- Order tracking and status management
- User management and content moderation tools