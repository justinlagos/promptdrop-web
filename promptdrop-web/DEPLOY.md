# Deploy PromptDrop web to a live URL

The app is a static Vite build. `vercel.json` and `public/_redirects` are already set so
client-side routes (`/pricing`, `/account`, `/app`) resolve on a static host.

Build once:

```
npm install
npm run build
```

That produces `dist/`. Pick one host:

## Option A — Vercel (CLI, easiest)

```
npm i -g vercel
vercel
```

Accept the defaults (framework: Vite, build `npm run build`, output `dist`). Then `vercel --prod`.
Set the same env vars from `.env` in the Vercel project settings (VITE_SUPABASE_URL,
VITE_SUPABASE_ANON_KEY). They're client-safe.

## Option B — Netlify (drag and drop)

Go to app.netlify.com → "Add new site" → "Deploy manually" → drag the `dist/` folder in.
`public/_redirects` is copied into `dist/` automatically, so routing works.

## Option C — Netlify (CLI)

```
npm i -g netlify-cli
netlify deploy --prod --dir dist
```

## After deploy

1. In Supabase → Authentication → URL Configuration, add your live URL to **Site URL** and
   **Redirect URLs** (e.g. `https://promptdrop.vercel.app`). This makes email confirmation links
   return to your site.
2. In Stripe, the checkout success/cancel URLs already use the page's own origin, so they follow
   wherever you host it.
