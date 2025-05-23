# Todo Summary Assistant - Backend

A Node.js backend for managing todos with AI summarization and Slack integration.

## Features

- RESTful API for todo management
- AI-powered todo summarization using Mistral
- Slack integration for sharing summaries
- User authentication
- Data persistence with Supabase

## Tech Stack

- Node.js
- Express.js
- Supabase (PostgreSQL)
- Mistral AI
- Slack Webhook

## Prerequisites

- Node.js 18+
- pnpm or npm
- Supabase account
- Mistral AI API key
- Slack workspace with incoming webhook

## Setup

1. Clone the repository
2. Navigate to the backend directory:

   ```bash
   cd backend
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the .env file with your Supabase credentials and Slack webhook URL.

5. Run the development server:
   ```bash
   pnpm dev
   ```
