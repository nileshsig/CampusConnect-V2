# Campus Connect

*Everything on campus, in one place.* Prepared for Vinoba Bhave University, Hazaribagh.

## Quick Start (Local Setup)

1. Ensure Node.js (v20+) is installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts
- **Student**: `asha@vbu.ac.in` (password: `DemoPass123!`)
- **Faculty**: `prasad@vbu.ac.in` (password: `DemoPass123!`)
- **Security**: `officer.singh@vbu.ac.in` (password: `DemoPass123!`)
- **Administrator**: `admin@vbu.ac.in` (password: `DemoPass123!`)

## Project Structure
- `docs/`: Product Requirements and specifications.
- `src/app/`: Next.js App Router pages (public landing, authenticated roles, modules).
- `src/components/`: Reusable design system, 3D campus model, module components.
- `src/lib/`: Database clients, role definitions, validators.
- `src/messages/`: Localized copy in plain English and Hindi (`en` and `hi`).
- `supabase/`: Database migrations and seed scripts.
- `scripts/`: Plain-language copy validation tools.
