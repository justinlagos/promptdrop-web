# Testing PromptDrop on a phone

The web app is mobile-first and installable (PWA). But there's one hard browser rule to know:

**Camera, microphone, and PWA install only work over HTTPS** (or on `localhost`). A phone
hitting your Mac's LAN IP over plain `http://` can browse every screen, but the browser will
block the camera/mic, so recording won't start. That's a browser security rule, not a bug.

So there are two ways to test on a phone:

## Quick UI check over your local network (no camera)
```
npm run dev:mobile
```
Vite prints a `Network:` URL like `http://192.168.x.x:5173`. Open that on your phone (same
Wi-Fi). You can navigate landing, welcome, pricing, account, scripts, redeem a code, etc.
Recording will be blocked because it's not HTTPS.

## Full test incl. recording + "Add to Home Screen" (recommended): deploy to HTTPS
Deploy takes ~1 minute and gives a real `https://` URL where everything works, including the
camera, mic, and installing it as an app.
```
npm run build
npx vercel        # then: npx vercel --prod
```
or drag the `dist/` folder onto app.netlify.com. See `DEPLOY.md`. Then:
- Open the live URL on your phone.
- iOS Safari: Share → Add to Home Screen. Android Chrome: menu → Install app.
- It launches full-screen like a native app; camera/mic recording works.

## Alternative: an HTTPS tunnel to your local dev
If you want camera on the phone without deploying:
```
npm run dev
npx cloudflared tunnel --url http://localhost:5173
```
Open the printed `https://…trycloudflare.com` URL on your phone.
