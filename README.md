<h1 align="center">NovaCV</h1>

<p align="center">
  Turn your LinkedIn PDF or resume into a beautiful personal website instantly.
</p>

<p align="center">
  <a href="https://novacv.dev">Live Site</a>
</p>

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **AI**: [OpenRouter](https://openrouter.ai) via Vercel AI SDK
- **Auth**: [Clerk](https://clerk.com)
- **Database**: [Upstash Redis](https://upstash.com)
- **File Uploads**: [UploadThing](https://uploadthing.com)
- **Styling**: Tailwind CSS + shadcn/ui
- **Fonts**: Geist
- **Analytics**: Plausible
- **Testing**: Vitest

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

## Environment Variables

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# OpenRouter
OPENROUTER_API_KEY=

# UploadThing
UPLOADTHING_TOKEN=

# Plausible (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

## Scripts

```bash
pnpm dev      # Development server
pnpm build    # Production build
pnpm test     # Run tests
pnpm lint     # Lint code
```
