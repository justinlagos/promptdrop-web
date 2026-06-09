# PromptDrop go-live audit

## Dependency Security

- npm audit passes (0 vulnerabilities).
- Vite dependency issue resolved: Vite is pinned to ^7.3.5 (installed 7.3.5), which
  depends on esbuild ^0.27 (installed 0.27.7), out of the vulnerable esbuild `<=0.24.2`
  range (GHSA-67mh-4wv8-2f99). The only esbuild copy in the tree is 0.27.7.
- @vitejs/plugin-react is pinned to ^4.7.0 (installed 4.7.0); its peer range includes
  Vite 7, so it is compatible with the installed Vite.
- No forced breaking upgrade was used: `npm audit fix --force` was not run, and Vite was
  not upgraded to 8.
- npm run build passes (Vite 7.3.5, 101 modules transformed).

Verified versions:
- vite: 7.3.5
- esbuild: 0.27.7
- @vitejs/plugin-react: 4.7.0
- npm audit: 0 vulnerabilities
- npm run build: passes
