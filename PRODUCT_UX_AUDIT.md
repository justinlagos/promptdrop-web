# PromptDrop UX audit

Scope of this pass: the three release-blocking issues named for the regression suite.
The wider brief (Clean Take redesign, desktop editor, Takes Library, sync) is not covered
here. Each row was checked against the code on branch `ux-regression-suite`.

| Issue | Impact | Root cause | Decision | Verified by |
| --- | --- | --- | --- | --- |
| Font size and scroll speed reset between takes | User re-does setup for every take | `RecordSetupScreen` set speed 142 and font 40 from hardcoded `useState` values on every mount. Nothing was saved anywhere. | Fixed. Last-used values saved to `pd.promptPrefs` on the device and loaded on mount, with range checks. | `prompt-preferences.spec.js`: two real takes, navigation, refresh. Fails when the hardcoded defaults are put back. |
| Font sizes above 40px did nothing | Slider offered 28 to 64 but the prompter capped at 40 | `Math.min(cfg.font, 40)` in the live prompter line styles | Fixed. The prompter uses the chosen size; neighbouring lines scale with it. | Same file. Fails when the cap is put back. |
| Last controls in each Clean Take tool hidden under the Save bar | Could not reach Reset, Saturation, Review removed sections, last Export rows | Save bar was an absolute overlay. The panel's bottom padding meant to clear it was cancelled by a `padding` shorthand in the same style object. | Fixed. Save bar is now a normal row below the panel. | `clean-take-mobile.spec.js`, "scrolled clear" test at 7 sizes. Fails when the overlay is put back. |
| Clean Take controls squeezed out on short phones | 65px of control space at 320x568 | Preview height was 36% of the screen regardless of height | Fixed. Preview height now scales with screen height, minimum 120px. Captions button moved above its explanation text. | `clean-take-mobile.spec.js`, "first control visible" test. Fails when 36vh is put back. |
| No desktop editing interface | Desktop users edit in a phone-width frame | `/app` renders the phone app in a 460px frame on desktop. `DesktopApp` in `src/App.jsx` exists but is not routed. | Not fixed. Needs the desktop editor from the brief. | Recorded as an expected-fail test in `clean-take-desktop.spec.js`. The editor being reachable on desktop is tested and passes. |
| Long prompter lines cut off inside the drop | Speaker loses words | Four lines of different sizes centred in a fixed-height box with overflow hidden | Not fixed. More visible now that large sizes work. | `prompter-fit.spec.js`, switched off until fixed. |
| Settings do not follow the account | New device starts from defaults | No account-backed preferences store | Not fixed. | `test.fixme` in `prompt-preferences.spec.js`. |
| Stale phone bundle | Fixed code not served | Bundle was built by hand with no script in the repo | Fixed. `npm run build:m`, plus a test that fails when the bundle is stale. | `bundle.spec.js` |
