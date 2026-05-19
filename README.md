# Concert Cost Tracker

Track concert spending, fun ratings, and value with a personal dashboard.

## Quick start

1. Copy `.env.local.example` to `.env.local` and add your Supabase URL and public key.
2. Install dependencies: `npm install`
3. Run the app: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Features

- Email sign up / log in (Supabase Auth)
- Add concerts with costs and fun rating (1–10)
- My Concerts list with cost per hour and Fun Points per $100
- Dashboard with stat cards and Recharts charts
- daisyUI theme selector

## Supabase

The `concerts` table uses Row Level Security so each user only sees their own data.
