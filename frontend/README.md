# Todo Summary Assistant - Frontend

A React-based frontend for managing todos with AI-powered summarization and Slack integration.

## Features

- View, add, edit, and delete todos
- Generate AI summaries of todo lists
- Send summaries to Slack

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Supabase

## Prerequisites

- Node.js 18+
- pnpm or npm

## Setup

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the .env file with your Slack webhook URL and Supabase credentials.

5. Run the development server:
   ```bash
   pnpm dev
   ```