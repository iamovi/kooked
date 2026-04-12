![KooKed Preview](./preview.png)

`KooKed` is an AI-powered website roaster. Paste any URL, and the application scrapes the site's content and utilizes a large language model to deliver a brutal, witty critique of the website.

## Live App

**https://kooked.vercel.app**

## Tech Stack
- Frontend: Next.js (App Router), React, Tailwind CSS, Radix UI Primitives.
- Backend API: Supabase Edge Functions (Deno).
- AI Intelligence: Groq API (Meta LLaMA 3.3 70B Versatile model).
- Parsing Technology: Jina Reader API (handled securely within the edge function).
- Typography & Icons: Inter Font, Lucide React.

## Local Development

### Prerequisites
- Node.js (v18+ recommended)
- Supabase CLI
- Groq API Key

### Installation

1. Clone this repository and navigate to the project root.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Establish your environment variables by creating a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SUPABASE_URL=https://your_project_id.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
4. Start the local Next.js development server:
   ```bash
   npm run dev
   ```
   The application will be accessible locally at http://localhost:3000.

### Supabase Edge Function Deployment

The backend logic containing the prompt injection and API calls is isolated in a Supabase Edge Function. This ensures API keys and system prompts remain secure and are not exposed to the client.

1. Ensure the Supabase CLI is authenticated and linked to your remote project:
   ```bash
   npx supabase login
   npx supabase link --project-ref your_project_ref
   ```
2. Configure your edge function secrets. You can do this in the Supabase Dashboard, or locally via the CLI:
   ```bash
   npx supabase secrets set GROQ_API_KEY=your_groq_api_key
   ```
3. Deploy the roasting function:
   ```bash
   npx supabase functions deploy roast
   ```

## Design System Note
The application discards typical modern soft UI (glassmorphism/blur) in favor of web brutalism. The `globals.css` defines exact variables for neo-shadows and translates standard Tailwind rounding into sharp 3px corners to maximize impact. 

## License

[MIT License](../LICENSE)
