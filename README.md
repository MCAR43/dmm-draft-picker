# Draft Picker

A draft board application for managing player drafts, built with Svelte, TailwindCSS, and Supabase.

## Features

- User authentication with Supabase Auth
- Create, edit, and delete draft boards
- Share draft boards with others
- User profiles with draft history

## Setup

1. Clone the repository
2. Install dependencies with `bun install` or `npm install`
3. Set up Supabase:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL in `supabase-setup.sql` in the Supabase SQL editor
   - Enable Email/Password authentication in Supabase Auth settings
   - Get your Supabase URL and anon key from the API settings
4. Create a `.env` file with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Start the development server with `bun run dev` or `npm run dev`

## Developing

Once you've set up the project and installed dependencies, start a development server:

```bash
# start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run build
```

You can preview the production build with `bun run preview`.

## Supabase Database Structure

The application uses a single `draft_boards` table with the following structure:

- `id`: UUID (primary key)
- `title`: TEXT (name of the draft)
- `captains`: JSON (array of captain names)
- `selections`: JSON (array of selected players)
- `user_id`: UUID (foreign key to auth.users)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

Row-level security policies ensure users can only access their own draft boards.
