# Web Chat App

A messaging application with push notifications.

Technologies:
- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Clerk](https://clerk.com/) - User authentication
- [Stream SDK](https://getstream.io/) - Chat API

## Getting Started

```bash
# Install project dependencies.
npm install

# Create environment variables file to store keys.
touch .env.local

# In the env file, add the following necessary keys without the square brackets:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[insert key string]
CLERK_SECRET_KEY=[insert key string]
NEXT_PUBLIC_STREAM_KEY=[insert key string]
STREAM_SECRET=[insert key string]

# Run the development server.
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

## Build for production
```bash
# Create distribution package.
npm run build

# Run the production build.
npm start
```

Open [http://localhost:3000](http://localhost:3000) in the browser.