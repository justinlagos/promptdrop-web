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
| `clean-take-desktop.spec.js` | Desktop users getting a details-only screen instead of the editor. |
| `bundle.spec.js` | `public/m/app.bundle.js` not rebuilt after its sources changed. |
| `prompter-fit.spec.js` | Current prompter line cut off inside the drop. Switched off, see below. |

## Known gaps

These are written down as tests so they are not forgotten.

- **Desktop editor layout** (`clean-take-desktop.spec.js`, marked `test.fail`). Desktop
  shows the phone editor in a 460px frame. The test describes the target layout and is
  expected to fail. When the desktop editor ships it will start passing, Playwright will
  flag that, and the `test.fail` line must be removed.
- **Settings sync across devices** (`prompt-preferences.spec.js`, `test.fixme`). Settings
  are saved per device. Needs account-backed storage and a test account.
- **Prompter line clipping** (`prompter-fit.spec.js`, `test.fixme`). Long paragraphs can be
  cut off inside the drop. Not stable enough to gate on until the layout is fixed.

## Rules for changing the app

- After editing anything in `public/m/app/` or `public/m/frames/`, run `npm run build:m`.
- Tests find elements by `data-testid`. If you rename or remove one, update the tests in
  the same change. Current hooks: `record-setup`, `prompt-speed`, `prompt-font`,
  `record-start`, `live-session`, `live-line-cur`, `live-stop`, `nav-back`, `ct-preview`,
  `ct-tabs`, `ct-tab-<Name>`, `ct-panel`, `ct-actions`.
- Fixed a UX bug? Add a test here that fails without the fix, and check that it does.
- Do not loosen a threshold to make a failing test pass. Fix the layout.
