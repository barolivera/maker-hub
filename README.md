# MAKER Hub

A decentralized learning platform where creators publish courses and students earn NFT badge certifications.

## Features

- Course creation and management
- Multiple payment models (free, upfront escrow, deferred)
- Lesson editor supporting video, text, and code
- Creator dashboard
- Student learning portal
- Smart contract integration for payments and rewards

## Tech Stack

- Next.js 13
- React 18
- TypeScript
- Supabase
- Tailwind CSS
- Radix UI Components

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### Vercel/Netlify/Other Platforms

1. Connect your Git repository
2. Set environment variables in your platform's dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy with build command: `npm run build`
4. The app will be available at your custom domain

### Environment Variables Setup

Make sure to add these environment variables in your deployment platform:
- Go to your project settings
- Find "Environment Variables" section
- Add both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Redeploy if necessary

## License

MIT
