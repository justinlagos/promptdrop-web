# UX regression suite

Browser tests that fail when a known PromptDrop UX bug comes back. They drive the real
built app in Chromium with a fake camera and microphone. No account or network is needed.

## Run

```
npm install
npx playwright install chromium     # first time only
npm run test:ux
```

Use an installed Chrome instead of Playwright's Chromium: `PW_CHANNEL=chrome npm run test:ux`.
Open the last HTML report: `npm run test:ux:report`. Failures save a screenshot and a trace
in `test-results/`.

The suite builds the site and serves it itself. GitHub runs it on every pull request and
on pushes to `main` (`.github/workflows/ux-regression.yml`).

## What each file guards

| File | Bug it stops from returning |
| --- | --- |
| `prompt-preferences.spec.js` | Font size and scroll speed reset between takes, after navigation or after a refresh. Also: the prompter ignoring sizes above 40px. |
| `clean-take-mobile.spec.js` | Clean Take controls hidden on phones: preview too tall, controls under the Save bar, first control below the fold. Seven phone sizes. |
| `clean-take-desktop.spec.js` | Desktop users getting a details-only screen, or the phone editor in a narrow frame, instead of a desktop editor: large preview, tools beside it, edit map below. |
| `clean-take-edits.spec.js` | Edits not saving themselves, not coming back on reopen, or lost when leaving quickly. Undo and redo. The recording being rewritten by a save. Pause detection marking steady audio as one long pause. Clean length shown as 0:00. |
| `landing.spec.js` | Marketing page motion going wrong: Lenis smooth scroll not running, section links broken, content left invisible by scroll reveals, sideways scrolling on phones, motion ignoring the reduced-motion setting. Also the logo's behaviours and the hero demo controls. |
| `bundle.spec.js` | `public/m/app.bundle.js` not rebuilt after its sources changed. |
| `prompter-fit.spec.js` | Script lines cut off inside the prompter. Steps through a whole script at 5 font sizes on 4 screen sizes and checks every chunk is fully visible and no words are lost. |

## Known gaps

None switched off at the moment. Settings and edits are saved per device. The app has no
sign-in by decision, so there is no cross-device sync to test.

## Rules for changing the app

- After editing anything in `public/m/app/` or `public/m/frames/`, run `npm run build:m`.
- Tests find elements by `data-testid`. If you rename or remove one, update the tests in
  the same change. Current hooks: `record-setup`, `prompt-speed`, `prompt-font`,
  `record-start`, `live-session`, `live-line-cur`, `live-stop`, `nav-back`, `app-shell`,
  `ct-preview`, `ct-tabs`, `ct-tab-<Name>`, `ct-panel`, `ct-actions` (phone), and on desktop
  `ct-desktop`, `ct-main`, `ct-side`, `ct-timeline`, `ct-timeline-bar`, `ct-timeline-pause`,
  `ct-export`. Both layouts: `ct-save-status`, `ct-undo`, `ct-redo`. Prompter: `live-drop`,
  `live-text`. Landing: `logo`, `logo-link`, `logo-tip`, `hero-demo`, `hero-demo-line`,
  `hero-demo-toggle`, `hero-demo-slower`, `hero-demo-faster`, `hero-demo-smaller`,
  `hero-demo-larger`, `hero-demo-speed`.
- Fixed a UX bug? Add a test here that fails without the fix, and check that it does.
- Do not loosen a threshold to make a failing test pass. Fix the layout.
