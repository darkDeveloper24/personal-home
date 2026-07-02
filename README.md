# Personal Home

A calm, aesthetic personal dashboard built with **Vite + React + TypeScript**. It currently includes three sections:

- **Work**
- **Body**
- **Money**

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev -- --host 127.0.0.1
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview -- --host 0.0.0.0
```

## Deploy to Vercel

This project is ready to deploy on **Vercel** and does **not** require renting a traditional server.

### Why `vercel.json` is included

The app uses **React Router** with client-side routes like:

- `/work`
- `/body`
- `/money`

On Vercel, direct refreshes to those URLs need to fall back to `index.html`, so the included `vercel.json` adds a rewrite for SPA routing.

### Option 1: Deploy from GitHub

1. Create a GitHub repository and push this project.
2. Sign in to [Vercel](https://vercel.com/).
3. Click **Add New → Project**.
4. Import your GitHub repository.
5. Vercel should detect this as a **Vite** project automatically.
6. Confirm these settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
7. Click **Deploy**.

After deployment, Vercel will provide a public URL you can open from other computers and phones.

### Option 2: Deploy with the Vercel CLI

Install the CLI if needed:

```bash
npm install -g vercel
```

Then from this project directory run:

```bash
vercel
```

For a production deployment:

```bash
vercel --prod
```

Follow the prompts. Vercel will detect the project settings and deploy the built site.

## Notes

- No custom backend server is required for this version.
- The production build output is in `dist/`.
- SPA routing is handled by `vercel.json`.
