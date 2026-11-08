# ADVSTAT Statistical Toolkit

A modular Next.js + React + TypeScript application based on the uploaded ADVSTAT requirements and UI sketch. It includes simple linear regression, one- and two-sample Z-test hypothesis testing, visualizations, and database-backed account registration/login.

## Technology
- Next.js App Router, React, TypeScript (JavaScript is enabled in the TypeScript configuration)
- Prisma ORM with SQLite by default
- bcryptjs password hashing and signed, HTTP-only session cookies using `jose`
- Recharts for statistical visualizations and Z-curve display
- Zod input validation

## Requirements
Install Node.js 20.9+ (Node 22 recommended) and npm.

## Setup
1. Extract the ZIP and open a terminal in the `advstat-project` folder.
2. Install packages:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and set a unique session secret. For example, use a long random string of at least 32 characters. Keep `.env` private and never commit it.
4. Generate Prisma Client and create the local database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Visit http://localhost:3000.

## Features
- Home page describing the two ADVSTAT analysis tools
- Registration with name, email, and password; duplicate emails are rejected
- Login/logout and a protected dashboard
- Simple linear regression: paired X/Y inputs, least-squares slope/intercept, Pearson correlation, R-squared, descriptive strength, scatter plot and best-fit line
- Hypothesis testing: one-sample Z-test against a hypothesized population mean and two-sample Z-test for independent means, with known population standard deviations; configurable alpha (0.10, 0.05, 0.01, 0.001), left/right/two-tailed alternative, Z-statistic, p-value, critical value, decision, and normal curve
- Responsive desktop/mobile layout

## Folder structure
- `src/app`: route pages, API endpoints, root layout and global styles
- `src/components/navbar`: navbar component
- `src/components/forms`: reusable authentication form
- `src/components/regression` and `src/components/hypothesis`: analysis UI and visualizations
- `src/components/ui`: reusable UI components
- `src/lib`: Prisma client and session handling
- `src/services`: authentication and user database operations
- `src/validators`: input schemas
- `src/utils`: statistical calculations
- `prisma`: Prisma schema and generated migration/database files

## Security and deployment notes
- Passwords are hashed with bcrypt; raw passwords are never saved.
- Session cookies are HTTP-only, SameSite=Lax, and Secure in production.
- Configure a strong `SESSION_SECRET` and a production database before deployment.
- For a production system, add rate limiting, account recovery, email verification, security monitoring, and a reviewed CSRF strategy before public launch.
- Statistical results are educational aids. Confirm assumptions, data quality, and test selection for your research question before drawing conclusions.

## Build checks
```bash
npm run typecheck
npm run build
```
