# AI Doubt Solver WebApp

## Overview

This is a full-stack AI-powered doubt solving application designed specifically for JEE/NEET aspirants. Students can upload images or type questions across Physics, Chemistry, Mathematics, and Biology subjects to receive detailed, step-by-step AI-generated solutions. The application features user authentication, subscription management, doubt history tracking, and a modern responsive UI built with React and shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design tokens and dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect for secure user management
- **Session Management**: Express sessions with PostgreSQL storage
- **AI Integration**: OpenAI GPT API for generating step-by-step solutions

### Database Design
- **Users Table**: Stores user profiles, subscription tiers, and daily usage tracking
- **Doubts Table**: Stores questions, solutions, subjects, and bookmark status
- **Sessions Table**: Required for Replit Auth session persistence
- **Schema Management**: Drizzle migrations with PostgreSQL dialect

### Authentication & Authorization
- **Provider**: Replit Auth with OAuth 2.0/OpenID Connect flow
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **Route Protection**: Middleware-based authentication checks for protected endpoints
- **User Management**: Automatic user creation on first login with profile data from auth provider

### AI Solution Generation
- **Provider**: OpenAI GPT API with structured JSON responses
- **Solution Format**: Step-by-step breakdowns with formulas, explanations, and difficulty ratings
- **Subject Handling**: Specialized prompts for Physics, Chemistry, Mathematics, and Biology
- **Response Processing**: Structured solution parsing with alternative methods and related concepts

### Subscription System
- **Tiers**: Free (5 doubts/day), Pro (unlimited), Premium (enhanced features)
- **Usage Tracking**: Daily limit enforcement with automatic reset
- **Upgrade Flow**: Pricing page with subscription management (payment integration ready)

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity with connection pooling
- **drizzle-orm**: Type-safe database ORM with PostgreSQL adapter
- **openai**: Official OpenAI API client for GPT integration
- **express**: Web application framework for Node.js
- **passport**: Authentication middleware with OpenID Connect strategy

### UI & Styling
- **@radix-ui/***: Headless UI primitives for accessible components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating component variants
- **framer-motion**: Animation library for smooth transitions
- **lucide-react**: Icon library with React components

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast bundling for production builds

### Authentication & Session
- **openid-client**: OpenID Connect client implementation
- **connect-pg-simple**: PostgreSQL session store
- **express-session**: Session middleware for Express

### Data Management
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation and type inference
- **date-fns**: Date utility library