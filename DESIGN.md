---
name: Jalan-Jalan
description: Singapore park-connector hikes, hawker stops, and cheap sights — one calm green field guide.
colors:
  canopy: "#0E6B45"
  canopy-soft: "#E3EFE7"
  canopy-ink: "#0A4F34"
  amber: "#B86E14"
  amber-soft: "#F6ECDB"
  plum: "#7C4FA0"
  plum-soft: "#EFE7F5"
  bg: "#F4F6F2"
  card: "#FFFFFF"
  ink: "#1A241E"
  muted: "#5C6A61"
  line: "#DDE4DC"
  chip: "#EAEFE8"
typography:
  display:
    fontFamily: 'Futura, "Century Gothic", "Avenir Next", "Trebuchet MS", ui-sans-serif, sans-serif'
    fontSize: "clamp(1.7rem, 5vw, 2.3rem)"
    fontWeight: 700
    letterSpacing: "0.02em"
  headline:
    fontFamily: 'Futura, "Century Gothic", "Avenir Next", "Trebuchet MS", ui-sans-serif, sans-serif'
    fontSize: "clamp(1.4rem, 4vw, 1.8rem)"
    fontWeight: 700
  title:
    fontFamily: 'Futura, "Century Gothic", "Avenir Next", "Trebuchet MS", ui-sans-serif, sans-serif'
    fontSize: "1.05rem"
    fontWeight: 700
    letterSpacing: "0.01em"
  body:
    fontFamily: 'Seravek, "Segoe UI", system-ui, -apple-system, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: 'Futura, "Century Gothic", "Avenir Next", "Trebuchet MS", ui-sans-serif, sans-serif'
    fontSize: "0.72rem"
    fontWeight: 700
    letterSpacing: "0.14em"
  data:
    fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace'
    fontSize: "0.85rem"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "8px"
  lg: "10px"
  full: "999px"
spacing:
  sm: "8px"
  md: "14px"
  lg: "16px"
  xl: "22px"
components:
  button-primary:
    backgroundColor: "{colors.canopy}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "11px 20px"
    typography: "{typography.display}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.canopy}"
    rounded: "{rounded.md}"
    padding: "9px 18px"
  chip:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "5px 12px"
  chip-selected:
    backgroundColor: "{colors.canopy}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "5px 12px"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "9px 2px"
    typography: "{typography.label}"
  tab-selected:
    backgroundColor: "{colors.canopy}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "9px 2px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input-search:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
---

# Design System: Jalan-Jalan

## Overview

**Creative North Star: "The Canopy Field Guide"**

Jalan-Jalan looks like a pocket nature field guide you'd carry under the trees: calm green light, precise monospace data callouts, warm but never fussy. The mood is calm, practical, and sunlit — the interface is built to be read at arm's length in Singapore glare with one sweaty thumb, so personality is carried by disciplined color coding and data typography, not by decoration. Every hue means something: green is the trail and the app's own voice, amber is makan, plum is sights. Nothing glows, spins, or gamifies.

The whole system runs on system font stacks and thirteen CSS custom properties per theme, defined once in `src/index.css` (`:root` for light, mirrored for dark via `prefers-color-scheme` and `data-theme`). That file is the normative source; there is no Tailwind, no theme framework, no webfont request.

Confirmed anti-references — what this app must never resemble: a food-blog listicle (ad-cluttered, hero-image-padded), a fitness-app dashboard (gradient stat rings, streaks, dark glass), or a government portal (bureaucratic forms, crests, dense officialdom).

**Key Characteristics:**
- Semantic three-hue palette on a green-tinted paper ground
- System fonts only; geometric display face, humanist body, mono for every number
- Flat paper-on-table surfaces: 1px borders structure, whisper shadows only
- Big one-thumb tap targets; the viewport never moves without the user asking
- Full light/dark mirror maintained token-for-token

## Colors

A green-tinted paper ground carrying three semantic accents — each hue is a content lane, never a decoration.

### Primary
- **Rainforest Canopy** (`--canopy`, #0E6B45): the app's voice — app title, links, selected tabs/chips, primary buttons, trail lines on the map, focus outlines. Dark theme brightens it to #3CB47E.
- **Canopy Wash** (`--canopy-soft`, #E3EFE7): tinted fill for tips panels, "walked" pills, free-cost tags. Dark: #162920.
- **Deep Canopy** (`--canopy-ink`, #0A4F34): text sitting on Canopy Wash. Dark: #8FD8B4.

### Secondary
- **Hawker Amber** (`--amber`, #B86E14): everything food — makan eyebrows, food-stop accent bars, cleaning-closure notices, alert borders. Dark: #E0A04A.
- **Amber Wash** (`--amber-soft`, #F6ECDB): alert and warn-pill backgrounds. Dark: #2A2416.

### Tertiary
- **Heritage Plum** (`--plum`, #7C4FA0): everything sights/attractions — see eyebrows, sight-stop accent bars, sight map markers. Dark: #B48BD6.
- **Plum Wash** (`--plum-soft`, #EFE7F5): sight-tinted fills. Dark: #271F30.

### Neutral
- **Paper** (`--bg`, #F4F6F2): page ground, faintly green-tinted so white cards read as laid-on paper. Dark: #101613.
- **Card White** (`--card`, #FFFFFF): all surfaces — cards, inputs, stops, map frame. Dark: #18211C.
- **Forest Ink** (`--ink`, #1A241E): primary text, near-black with a green cast. Dark: #E6EDE7.
- **Moss Grey** (`--muted`, #5C6A61): secondary text, blurbs, credits, stat labels. Dark: #93A398.
- **Hairline** (`--line`, #DDE4DC): every border and divider. Dark: #2A362E.
- **Chip Fill** (`--chip`, #EAEFE8): resting fill for chips, pills, cost tags, station lozenges. Dark: #222D26.

### Named Rules
**The Content-Colour Rule.** Green speaks for the app and the trail, amber only for food, plum only for sights. A hue never appears outside its lane; a new content type earns a new hue rather than borrowing one.

**The Bright-Fill Rule.** Text on canopy-filled controls is white (#FFFFFF) in light theme but near-black (#0E1512) in dark theme, because Rainforest Canopy brightens to #3CB47E there. Every filled control (tab, chip, walk button, copy button) carries both overrides.

**The MRT Livery Rule.** MRT line dots use the official transit colors hardcoded in `src/data.ts` (`LINE`: NS #D42E12, EW #009645, NE #9900AA, CC #FA9E0D, DT #005EC4, TE #9D5B25, LRT #748477). They are external livery, never themed, never adjusted for dark mode.

## Typography

**Display Font:** Futura (falling back through Century Gothic, Avenir Next, Trebuchet MS to ui-sans-serif)
**Body Font:** Seravek (falling back through Segoe UI to system-ui)
**Label/Mono Font:** ui-monospace (SF Mono, Menlo, Consolas)

**Character:** A geometric mid-century display voice — the register of vintage national-park signage — over a warm humanist body, with a monospace third voice reserved for anything measured. All three are system stacks: zero font requests, per-platform rendering, in keeping with the keyless architecture.

### Hierarchy
- **Display** (700, clamp(1.7rem, 5vw, 2.3rem), 0.02em tracking, Rainforest Canopy): the app title only.
- **Headline** (700, clamp(1.4rem, 4vw, 1.8rem), `text-wrap: balance`): trail detail titles.
- **Title** (700, 1.05rem, 0.01em tracking, balanced): card headings.
- **Body** (400, 1rem, 1.55 line-height): prose, blurbs, stop descriptions.
- **Label** (700, 0.72rem, 0.14em tracking, UPPERCASE): section eyebrows — hue-coded to their content lane (trail green, food amber, sight plum).

### Named Rules
**The Measured-Voice Rule.** Every number the user might compare — kilometres, prices, dates, times, progress counts — is set in the mono stack with `font-variant-numeric: tabular-nums`. The big km stat is mono 700 at 1.5rem; costs and schedules run 0.78–0.85rem. Prose never carries data styling; data never wears prose type.

## Layout

A single centered column, `max-width: 860px`, with 16px side gutters and 80px bottom clearance for thumb reach. The tab bar is the only sticky element (`position: sticky; top: 0`), sitting flush on the page ground with a hairline bottom border — content scrolls beneath it.

Cards flow in a responsive grid: `repeat(auto-fill, minmax(250px, 1fr))` with 14px gaps — one column on phones, two to three on desktop, with no breakpoint declarations anywhere; the grid and `clamp()` type do all responsive work. Sections separate by 22px top margin, headed by an eyebrow label. Card interiors run an 8px vertical rhythm with 16px padding; list rows (stops, plan items) use 10px × 14px padding. The map panel is `min(68vh, 480px)` tall so a control strip stays visible below it. Wide tables wrap in an `overflow-x: auto` container rather than stretching the page.

## Elevation & Depth

Paper on a table. Structure comes from 1px Hairline borders and tonal steps (Paper ground → Chip Fill → Card White); the shadow is a whisper of ambience, not a lift. Nothing floats, and the only elevation change in the whole app is the card hover rising 2px.

### Shadow Vocabulary
- **Ambient** (`box-shadow: 0 1px 2px rgba(20,35,26,.08), 0 4px 14px rgba(20,35,26,.06)`): the single shadow token (`--shadow`), applied to cards only. Dark theme deepens it to black at .4/.3 alpha.
- **Marker ring** (`box-shadow: 0 1px 3px rgba(0,0,0,.45)`): grounds the 22px map markers against tile imagery; the only hard shadow, justified by the busy map background.

### Named Rules
**The Paper-on-Table Rule.** Borders do the structure; shadows are ambient only. Never add a heavier shadow to signify importance — importance is a hue, a border accent, or type weight.

## Shapes

Softly rounded, sturdy, never bubbly. Four radius tiers, each with a fixed job: **4px** for small data tags (cost tags, pills, as-of stamps), **8px** for interactive surfaces (buttons, inputs, tabs, stop rows, the map itself), **10px** for containers (cards, map frame), **999px** for chips, station lozenges, and dots.

The signature form is the **left accent bar**: a 3px border-left in the content hue marks stop rows, food/sight cards, and alerts — the field guide's margin stripe. Map markers are 22px circles with a 2px white ring; MRT markers square off to 5px radius to read as stations. Card photos bleed to the card edge (negative margin) with the card's top radius, keeping images inside the paper metaphor.

## Components

### Buttons
Sturdy and friendly: generous padding, confident filled states, park-signage weight.
- **Shape:** softly rounded (8px)
- **Primary** (copy/share): Rainforest Canopy fill, white text (Bright-Fill Rule in dark), 11px 20px padding, display face 700 with 0.03em tracking.
- **Outline toggle** (mark walked): transparent with 1px Canopy border and Canopy text, 9px 18px; fills solid Canopy when pressed (`aria-pressed`).
- **Ghost** (back, map actions): borderless Canopy text at weight 600, full-height tap padding.
- **Hover / Focus:** cards lift 2px on hover (`transition: transform .12s ease`); every interactive element gets a 2px Canopy `outline` with 2px offset on `:focus-visible`. `prefers-reduced-motion` disables all transitions globally.

### Chips
- **Style:** Chip Fill background, 1px Hairline border, full-round (999px), 5px 12px, 0.85rem.
- **State:** `aria-pressed="true"` fills solid Canopy (Bright-Fill text rule applies). Chips are filters, not decoration.

### Cards / Containers
- **Corner Style:** 10px
- **Background:** Card White over Paper ground
- **Shadow Strategy:** Ambient token only (see Elevation)
- **Border:** 1px Hairline; food/sight variants add the 3px left accent bar
- **Internal Padding:** 16px, 8px vertical gap; photos bleed full-width to the top edge at 16:9

### Inputs / Fields
- **Style:** Card White fill, 1px Hairline border, 8px radius, 10px 12–14px padding, inherited body font.
- **Focus:** 2px Canopy outline, 1px offset — no glow, no border-color morph.
- **Checkboxes:** `accent-color: var(--canopy)`.

### Navigation
Sticky top tab bar of five equal-width text tabs in the display face (600, 0.84rem). Resting tabs are Moss Grey on transparent; the active tab fills solid Canopy (8px radius, Bright-Fill text). No icons, no underline animation — state is the fill.

### Map Markers (signature)
Leaflet `divIcon` pins: 22px circles, 2px white ring, mono 700 10px numeral, hard grounding shadow. Hue follows the Content-Colour Rule — amber food, plum sights; MRT stations are dark squares (#3A4A40, 5px radius). Popups are 210px mini-cards: bold name, 16:10 photo, mono cost tag, link row — information lives in the popup, never by scrolling the page.

## Do's and Don'ts

### Do:
- **Do** keep every colour, font, and shadow flowing from the custom properties in `src/index.css`; add a token there before using a new value, and mirror it in both dark blocks (`prefers-color-scheme` **and** `[data-theme]`).
- **Do** set every comparable number in mono with `tabular-nums` (Measured-Voice Rule).
- **Do** keep tap targets generous (≥32px) and legible in direct sunlight — Moss Grey is the floor for text contrast.
- **Do** keep the 3px left accent bar as the marker for typed content (amber food, plum sights).
- **Do** preserve required attributions: OneMap © Singapore Land Authority, Esri imagery, Leaflet, and in-app Wikimedia photo credits.

### Don't:
- **Don't** add webfonts, icon fonts, or any font network request — system stacks only.
- **Don't** use gradients, glassmorphism, stat rings, streaks, or badge gamification (fitness-dashboard anti-reference).
- **Don't** move the viewport on marker or pin tap; popups carry the information (No-Jump behaviour, learned the hard way).
- **Don't** style bare `svg` in global CSS — Leaflet's overlay pane is plain SVG and a loose rule silently kills route lines. Scope SVG styling tightly.
- **Don't** theme or adjust the MRT line colours (MRT Livery Rule).
- **Don't** let a hue leave its content lane — no plum buttons, no amber links, no decorative green.
