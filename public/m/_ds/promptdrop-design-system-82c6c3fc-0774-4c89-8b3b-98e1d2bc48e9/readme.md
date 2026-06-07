# PromptDrop, Design System

> A teleprompter that lives **beside your camera**. The hero of the brand is the
> black **Prompt Drop**, a rounded surface that extends from the laptop
> camera/notch and becomes the live reading surface.

PromptDrop is a camera-level teleprompter platform for people who record
themselves on screen. Instead of putting prompter text in the middle of the
display, the app opens a black "drop" from the notch area so the reader's eyes
stay next to the lens. The web app is the **control room** (write, tune, launch,
record, review); the **Prompt Drop** is the live teleprompter; an **animated
character** gives calm feedback throughout.

**Core principle: protect eye contact.** Every decision should help someone read
naturally while keeping their eyes close to the camera.

### Sources provided
- `uploads/promptdrop-logo-01.svg`, wordmark, dark text on transparent
- `uploads/promptdrop-logo-02.svg`, wordmark, white on charcoal (#232323)
- `uploads/promptdrop-logo-03.svg`, two-tone wordmark variants
- A full written brief (brand personality, principles, tokens, screen list)

There was **no codebase or Figma**, this system is authored from the brief and
the three logo files. Visual/UX decisions are documented below so they can be
ratified or adjusted.

---

## CONTENT FUNDAMENTALS, how PromptDrop writes

**Voice:** calm, confident, quietly clever. It speaks like a thoughtful tool that
respects the user's time. Premium but human, never hypey, never cute.

- **Person:** second person ("**your** lens", "**you** sound like a person").
  The product refers to itself as "PromptDrop", rarely "we".
- **Spelling:** British/international, **colour**, **centre**, **personalise**.
- **Casing:** Sentence case everywhere (buttons, titles, menu items). The
  wordmark is lowercase `promptdrop`; mono **eyebrows/metadata are UPPERCASE**
  with wide tracking (e.g. `NOW PROMPTING`, `WILL RECORD`).
- **Length:** short. Headlines are one idea. Body copy is 1–2 sentences. Empty
  states are a single encouraging line + one action.
- **Tone of status copy:** reassuring, never alarming. Warnings are gentle
  ("Speed looks a little fast for this script."), errors are plain and
  actionable ("Camera permission is missing. Retry / Exit.").
- **Numbers as proof, not decoration:** show reading time, wpm, duration, filler
  count, only where they help the user improve. No vanity stats.
- **No emoji.** Personality comes from the **animated character** and the mono
  voice, not emoji or exclamation marks.

**Signature lines:** "Read naturally on camera, without losing eye contact." ·
"Keep your eyes on the lens." · "A teleprompter that lives beside your camera." ·
"Eyes right beside the lens."

---

## VISUAL FOUNDATIONS

**Overall:** dark-first, cinematic, Mac-native. Think Apple Dynamic Island ×
Linear × Screen Studio. Spacious, sharp, calm. The pure-black Prompt Drop is the
one fixed, sacred element; everything else is refined charcoal that supports it.

**Colour**
- App surfaces are a tight **charcoal/ink scale** (`--ink-950` background →
  `--ink-800` elevated). The Prompt Drop is **pure `#000`**, always, even in
  light mode.
- One accent: **electric blue `#4C8DFF`** (`--accent-primary`) for active states,
  focus, progress, primary actions. **Soft violet `#8B7CFF`** is a sparing
  secondary (AI / character moments).
- Semantics: green `#2FCF8F` success, amber `#F5A524` warning, red `#F0506E`
  error, and a distinct **Apple-red `#FF3B30` recording** colour that only ever
  means "recording".
- Tints (`--blue-tint`, etc.) at ~14% are used for soft fills/washes. Avoid
  purple-blue gradients except the one restrained hero glow.

**Type**
- **Manrope** (grotesque) for all UI and the reading surface.
- **JetBrains Mono** for the logo wordmark, eyebrows, metadata, shortcuts,
  numbers (wpm/timecodes). Mono = "system voice".
- Display is heavy (800) and tightly tracked (`-0.03em`). Teleprompter type is
  fluid: **current line large + high-contrast**, adjacent lines faded
  (`--tp-adjacent` 42%), far lines barely there (`--tp-far` 16%).

**Spacing & layout**, 8px base (4px half-step). App feels roomy: 48px page
gutters, 24px card padding, generous Prompt Drop safe areas so text and the
character never crowd the rounded edges. Desktop-first; the control app assumes
≥1180px and the live Prompt Drop is a desktop/laptop experience.

**Radius**, controls 10px, cards 14px, panels 20px. The **`--radius-promptdrop`
40px** corner is the most recognisable shape in the brand; the docked notch
corner is 22px.

**Shadows**, soft, diffuse, low-contrast (never heavy). The signature
`--shadow-promptdrop` makes the drop feel lifted from the bezel. Two glows:
`--glow-focus` (blue ring) and `--glow-recording` (red halo).

**Motion**, calm, physical, purposeful. The signature gesture is the Prompt
Drop **expanding from the camera zone** (`--ease-drop`, 480ms), a gentle spring,
never bouncy. Text scrolls smoothly; status fades; the recording dot pulses on a
1.8s period. **During active prompting the character shrinks to ~26px and goes
quiet** so nothing competes with the words. All movement collapses to instant
fades under `prefers-reduced-motion`.

**Interaction states**, hover lifts surfaces (`translateY(-1px)`) and brightens
fills (`brightness(1.08)`); press shrinks slightly (`scale(0.99)`). Focus uses
the blue glow ring. Borders are hairline white-alpha on dark.

**Cards**, elevated charcoal, hairline border, soft surface shadow, 14px radius.
Interactive cards lift on hover. Empty-state cards are dashed/ghost. No
coloured-left-border cards, no glassmorphism, no neon.

**Imagery**, the brand leans on the **product itself** (MacBook + drop) rather
than stock photography. Camera scenes are cool, dark, slightly cinematic
gradients. Real user webcam/photo content drops into placeholders.

---

## ICONOGRAPHY

- **Line icons, Lucide-style**: 24px grid, ~1.75 stroke, round caps/joins,
  currentColor, no fills (except play/pause triangles). The control-app kit ships
  an inline set in `ui_kits/control-app/icons.jsx`; for production, use
  [Lucide](https://lucide.dev) (CDN or package) to match exactly. **Substitution
  flagged:** these are Lucide-equivalent hand-traced paths, not the official
  package, swap in real Lucide for pixel parity.
- **The three-dot motif** (from the logo) is the brand's signature glyph: the
  camera-lens dots at the top of every Prompt Drop, and the **eyes of the
  animated character**. Reuse it; it ties the whole system together.
- **No emoji. No unicode glyph icons.** Status is shown with the recording dot,
  badges, and the character.
- Brand marks live in `assets/` (see index). The animated **character** is
  authored as a real component (`PromptCharacter`), line-art on black, driven by
  a `state` prop, not as static art.

---

## DESIGN TOKENS (where to look)

All tokens are CSS custom properties, shipped via `styles.css`. Base scales +
semantic aliases:

| Concern | File | Examples |
|---|---|---|
| Colour | `tokens/colors.css` | `--bg-primary`, `--promptdrop-bg`, `--accent-primary`, `--recording`, `--tp-current` |
| Type | `tokens/typography.css` | `--font-sans`, `--font-mono`, `--text-display-*`, `--tp-current-size`, `--countdown-size` |
| Spacing | `tokens/spacing.css` | `--space-*`, `--promptdrop-pad-x`, `--nav-width` |
| Radius / Shadow | `tokens/radius-shadow.css` | `--radius-promptdrop`, `--shadow-promptdrop`, `--glow-recording` |
| Motion / Z | `tokens/motion.css` | `--ease-drop`, `--motion-promptdrop-expand`, `--z-promptdrop` |
| Fonts | `tokens/fonts.css` | Manrope + JetBrains Mono (CDN) |

> **Font note / substitution:** Manrope and JetBrains Mono load from the Google
> Fonts CDN. The logo specifies JetBrains Mono (matched exactly). Manrope is the
> chosen UI grotesque (SF-Pro-adjacent, premium, freely available). For
> production, **self-host the woff2 files** and repoint `tokens/fonts.css`.

---

## INDEX, what's in this project

**Foundations**
- `styles.css`, global entry point (import this one file)
- `tokens/`, colours, typography, spacing, radius-shadow, motion, fonts, base
- `guidelines/*.html`, specimen cards rendered in the Design System tab
  (Colors, Type, Spacing, Motion, Brand)

**Assets** (`assets/`)
- `logo-wordmark-dark.svg` / `-light.svg` / `-duo.svg`, the wordmark lockups
- `mark-dots-light.svg` / `-dark.svg`, the three-dot mark
- `app-icon.svg`, squircle app icon (drop + scrolling lines)
- `prompt-drop-glyph.svg`, the hero drop glyph

**Components** (`components/<group>/`, `window.PromptDropDesignSystem_82c6c3`)
- `buttons/`, `Button` (incl. `launch` & `recording`), `IconButton`
- `forms/`, `Input`, `Textarea`, `Select`, `Switch`, `Slider`, `SegmentedControl`
- `display/`, `Card`, `Badge`, `Tag`, `Avatar`
- `feedback/`, `Alert`, `Toast`, `Spinner`
- `promptdrop/`, **`PromptDrop`** (the hero, all states) & **`PromptCharacter`**

**UI kits** (`ui_kits/`)
- `control-app/`, the full control web app: Dashboard, Script Studio, Prompt
  Settings, Library, Take Review, and a live **Launch** overlay
- `prompt-drop/`, the Prompt Drop experience in a MacBook frame, cycling every
  state (idle → countdown → prompting → paused → processing → complete →
  warning → error)
- `marketing/`, the landing page (hero, features, character, pricing)

**Other**
- `SKILL.md`, makes this usable as a downloadable Agent Skill
- `readme.md`, this file

---

## DEVELOPER HANDOFF NOTES
- Link `styles.css`; set `data-theme="dark"` (default identity) or `"light"` on
  `<html>`. The Prompt Drop stays black in both.
- Reference semantic tokens, not raw scale values, in product code.
- The Prompt Drop must sit above everything (`--z-promptdrop`) and should animate
  open with `--motion-promptdrop-expand` from the camera anchor.
- Honour `prefers-reduced-motion` and always provide a character-free,
  fully-labelled path (the character is feedback, never the only signal).
